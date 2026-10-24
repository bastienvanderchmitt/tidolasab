<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Exceptions\BusinessException;
use App\Mail\AdminNewBooking;
use App\Mail\BookingCancelled;
use App\Mail\BookingPending;
use App\Mail\BookingReceived;
use App\Mail\BookingValidated;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Payment;
use Carbon\CarbonImmutable;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class BookingService
{
    public function __construct(private readonly PricingService $pricing) {}

    /**
     * Crée une réservation depuis le site public ou depuis l'admin.
     *
     * Côté public, le type est toujours « Classique » et le prix est recalculé ici.
     * L'admin peut choisir le type (Booking, AirBnb, Fermeture) et saisir le prix.
     */
    public function create(array $data, bool $isAdmin): Booking
    {
        $type = $isAdmin ? BookingType::from($data['type']) : BookingType::Classique;
        $quote = $this->pricing->quote($data['checkIn'], $data['checkOut'], (int) $data['adults']);

        if (! $isAdmin) {
            $this->ensureStayAllowed($data['checkIn'], $data['checkOut'], $quote->nights);
        }

        $total = match (true) {
            $type === BookingType::Fermeture => 0,
            $isAdmin && isset($data['total']) => (float) $data['total'],
            default => $quote->total,
        };

        [$booking, $client] = DB::transaction(function () use ($data, $type, $quote, $total) {
            $this->ensureDatesAvailable($data['checkIn'], $data['checkOut']);

            $booking = Booking::create([
                'date_arrivee' => $data['checkIn'],
                'date_depart' => $data['checkOut'],
                'nombre_nuits' => $quote->nights,
                'adultes' => (int) $data['adults'],
                'enfants' => (int) ($data['children'] ?? 0),
                'prix_total' => $total,
                'type' => $type,
                'statut' => $type === BookingType::Fermeture ? BookingStatus::Validated : BookingStatus::Pending,
                'note' => $data['note'] ?? null,
            ]);

            $client = null;
            if ($type !== BookingType::Fermeture) {
                $client = Client::create([
                    'nom' => $data['name'] ?? '',
                    'prenom' => $data['firstName'] ?? '',
                    'email' => $data['email'] ?? '',
                    'telephone' => $data['phone'] ?? '',
                    'adresse' => $this->formatAddress($data),
                    'language' => $data['language'] ?? 'fr',
                ]);
                $booking->clients()->attach($client);
            }

            return [$booking, $client];
        });

        if ($client?->email && (! $isAdmin || $type === BookingType::Classique)) {
            $this->sendToClient($client, new BookingReceived($booking));
        }

        if ($type !== BookingType::Fermeture) {
            $this->send(config('tidolasab.admin_email'), new AdminNewBooking($booking, $client));
        }

        return $booking;
    }

    public function update(Booking $booking, array $data): Booking
    {
        $type = BookingType::from($data['type']);

        DB::transaction(function () use ($booking, $data, $type) {
            $status = $type === BookingType::Fermeture ? BookingStatus::Validated : $booking->statut;

            if ($status === BookingStatus::Validated) {
                $this->ensureDatesAvailable($data['checkIn'], $data['checkOut'], $booking);
            }

            $booking->update([
                'date_arrivee' => $data['checkIn'],
                'date_depart' => $data['checkOut'],
                'nombre_nuits' => CarbonImmutable::parse($data['checkIn'])->diffInDays($data['checkOut']),
                'adultes' => (int) $data['adults'],
                'enfants' => (int) ($data['children'] ?? 0),
                'prix_total' => $type === BookingType::Fermeture ? 0 : (float) $data['total'],
                'type' => $type,
                'statut' => $status,
                'note' => $data['note'] ?? null,
            ]);
        });

        return $booking;
    }

    /**
     * Valide la réservation et enregistre l'acompte reçu.
     */
    public function validate(Booking $booking, float $deposit, string $date, string $method): Booking
    {
        DB::transaction(function () use ($booking, $deposit, $date, $method) {
            $this->ensureDatesAvailable($booking->date_arrivee->toDateString(), $booking->date_depart->toDateString(), $booking);

            $booking->update(['statut' => BookingStatus::Validated]);
            $booking->payments()->create([
                'montant_paiement' => $deposit,
                'date_paiement' => $date,
                'moyen_paiement' => $method,
            ]);
        });

        $client = $booking->primaryClient();
        if ($client?->email && $booking->type === BookingType::Classique) {
            $this->sendToClient($client, new BookingValidated($booking, $client, $deposit));
        }

        return $booking;
    }

    public function cancel(Booking $booking): Booking
    {
        $booking->update(['statut' => BookingStatus::Cancelled]);

        $client = $booking->primaryClient();
        if ($client?->email) {
            $this->sendToClient($client, new BookingCancelled);
        }

        return $booking;
    }

    public function setPending(Booking $booking): Booking
    {
        $booking->update(['statut' => BookingStatus::Pending]);

        $client = $booking->primaryClient();
        if ($client?->email) {
            $this->sendToClient($client, new BookingPending($client));
        }

        return $booking;
    }

    public function delete(Booking $booking): void
    {
        DB::transaction(function () use ($booking) {
            $booking->clients()->detach();
            $booking->delete();
        });
    }

    /**
     * Acompte et solde restant d'une réservation.
     */
    public function balance(Booking $booking): float
    {
        return round($booking->prix_total - Payment::where('id_reservation', $booking->id)->sum('montant_paiement'), 2);
    }

    private function ensureStayAllowed(string $checkIn, string $checkOut, int $nights): void
    {
        $minimum = config('tidolasab.minimum_nights');
        if ($nights < $minimum) {
            throw new BusinessException(__('booking.minimum_nights', ['nights' => $minimum]));
        }

        foreach (config('tidolasab.minimum_stay_periods') as $period) {
            $overlapsPeriod = $checkIn <= $period['end'] && $checkOut > $period['start'];
            if ($overlapsPeriod && $nights < $period['nights']) {
                throw new BusinessException(__('booking.minimum_stay_period', [
                    'nights' => $period['nights'],
                    'start' => CarbonImmutable::parse($period['start'])->format('d/m/Y'),
                    'end' => CarbonImmutable::parse($period['end'])->format('d/m/Y'),
                ]));
            }
        }
    }

    /**
     * À appeler dans une transaction : verrouille les réservations concurrentes.
     */
    private function ensureDatesAvailable(string $checkIn, string $checkOut, ?Booking $except = null): void
    {
        $taken = Booking::overlapping($checkIn, $checkOut)
            ->when($except, fn ($query) => $query->whereKeyNot($except->getKey()))
            ->lockForUpdate()
            ->exists();

        if ($taken) {
            throw new BusinessException(__('booking.dates_unavailable'));
        }
    }

    private function formatAddress(array $data): string
    {
        $cityLine = trim(($data['postalCode'] ?? '').' '.($data['city'] ?? ''));

        return collect([$data['address'] ?? '', $cityLine, $data['country'] ?? ''])
            ->map(fn ($part) => trim((string) $part))
            ->filter()
            ->implode(', ');
    }

    private function sendToClient(Client $client, Mailable $mail): void
    {
        $this->send($client->email, $mail->locale($client->mailLocale()));
    }

    /**
     * Un email qui échoue ne doit pas annuler l'action : l'erreur est remontée à Sentry.
     */
    private function send(string $to, Mailable $mail): void
    {
        rescue(fn () => Mail::to($to)->send($mail));
    }
}
