<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
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
    public function __construct(
        private readonly PricingService $pricing,
        private readonly BookingSettings $settings,
    ) {}

    /**
     * Crée une réservation depuis le site public ou depuis l'admin.
     *
     * Côté public, le type est toujours « Classique » et le prix est recalculé ici.
     * L'admin peut choisir le type (Booking, AirBnb, Fermeture), saisir le prix
     * et rattacher la réservation à un client existant.
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

        [$booking, $client] = DB::transaction(function () use ($data, $type, $quote, $total, $isAdmin) {
            $this->ensureDatesAvailable($data['checkIn'], $data['checkOut']);

            $booking = Booking::create([
                'date_arrivee' => $data['checkIn'],
                'date_depart' => $data['checkOut'],
                'nombre_nuits' => $quote->nights,
                'adultes' => (int) $data['adults'],
                'enfants' => (int) ($data['children'] ?? 0),
                'prix_total' => $total,
                // Côté public, la taxe est toujours celle du calcul
                'taxe_sejour' => $this->touristTaxFor($type, $quote, $isAdmin ? $data : []),
                'type' => $type,
                'statut' => $type === BookingType::Fermeture ? BookingStatus::Validated : BookingStatus::Pending,
                'note' => $data['note'] ?? null,
            ]);

            $client = null;
            if ($type !== BookingType::Fermeture) {
                $client = $isAdmin && ! empty($data['clientId'])
                    ? Client::findOrFail($data['clientId'])
                    : Client::create([
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
            $this->sendToClient($client, new BookingReceived(
                $booking,
                $this->amountDueAtBooking($booking),
                $this->requiresFullPayment($booking),
            ));
        }

        if ($type !== BookingType::Fermeture) {
            $this->send(config('tidolasab.admin_email'), new AdminNewBooking($booking, $client, $this->requiresFullPayment($booking)));
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

            $quote = $this->pricing->quote($data['checkIn'], $data['checkOut'], (int) $data['adults']);

            $booking->update([
                'date_arrivee' => $data['checkIn'],
                'date_depart' => $data['checkOut'],
                'nombre_nuits' => $quote->nights,
                'adultes' => (int) $data['adults'],
                'enfants' => (int) ($data['children'] ?? 0),
                'prix_total' => $type === BookingType::Fermeture ? 0 : (float) $data['total'],
                'taxe_sejour' => $this->touristTaxFor($type, $quote, $data),
                'type' => $type,
                'statut' => $status,
                'note' => $data['note'] ?? null,
            ]);

            $this->syncBalanceDraft($booking);
        });

        return $booking;
    }

    /**
     * Valide la réservation et enregistre l'acompte reçu.
     * Pour une réservation directe, le solde restant devient un paiement brouillon.
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
                'statut' => PaymentStatus::Confirmed,
            ]);

            $this->syncBalanceDraft($booking);
        });

        $client = $booking->primaryClient();
        if ($client?->email && $booking->type === BookingType::Classique) {
            $balance = $this->balance($booking);
            $this->sendToClient($client, new BookingValidated(
                $booking,
                $client,
                $deposit,
                $balance,
                $balance > 0 ? $this->balanceDueDate($booking) : null,
            ));
        }

        return $booking;
    }

    public function cancel(Booking $booking): Booking
    {
        DB::transaction(function () use ($booking) {
            $booking->update(['statut' => BookingStatus::Cancelled]);
            $booking->payments()->draft()->delete();
        });

        $client = $booking->primaryClient();
        if ($client?->email) {
            $this->sendToClient($client, new BookingCancelled);
        }

        return $booking;
    }

    public function setPending(Booking $booking): Booking
    {
        DB::transaction(function () use ($booking) {
            $booking->update(['statut' => BookingStatus::Pending]);
            $booking->payments()->draft()->delete();
        });

        $client = $booking->primaryClient();
        if ($client?->email) {
            $this->sendToClient($client, new BookingPending($client));
        }

        return $booking;
    }

    /**
     * Une réservation avec des paiements encaissés s'annule mais ne se supprime pas,
     * sinon ces paiements disparaîtraient du chiffre d'affaires.
     */
    public function delete(Booking $booking): void
    {
        if ($booking->payments()->confirmed()->exists()) {
            throw new BusinessException(__('booking.has_payments'));
        }

        DB::transaction(function () use ($booking) {
            $booking->clients()->detach();
            $booking->payments()->draft()->delete();
            $booking->delete();
        });
    }

    /**
     * Encaisse un paiement brouillon. S'il reste un solde, un nouveau brouillon est créé.
     */
    public function confirmDraft(Payment $draft, ?float $amount, string $date, string $method): Payment
    {
        if (! $draft->isDraft()) {
            throw new BusinessException(__('booking.payment_not_draft'));
        }

        DB::transaction(function () use ($draft, $amount, $date, $method) {
            $draft->update([
                'statut' => PaymentStatus::Confirmed,
                'montant_paiement' => $amount ?? $draft->montant_paiement,
                'date_paiement' => $date,
                'moyen_paiement' => $method,
            ]);

            $this->syncBalanceDraft($draft->booking);
        });

        return $draft;
    }

    /**
     * Tient à jour le brouillon du solde d'une réservation directe validée :
     * montant = prix total - paiements encaissés, supprimé quand tout est réglé.
     */
    public function syncBalanceDraft(Booking $booking): void
    {
        $drafts = $booking->payments()->draft()->orderBy('id')->get();
        $remaining = $this->balance($booking);

        if (! $this->expectsBalance($booking) || $remaining <= 0) {
            $drafts->each->delete();

            return;
        }

        $draft = $drafts->shift();
        $drafts->each->delete();

        if ($draft) {
            $draft->update(['montant_paiement' => $remaining]);
        } else {
            $booking->payments()->create([
                'montant_paiement' => $remaining,
                'date_paiement' => $this->balanceDueDate($booking)->toDateString(),
                'moyen_paiement' => PaymentMethod::Transfer,
                'statut' => PaymentStatus::Draft,
                'note' => __('booking.balance_draft_note'),
            ]);
        }
    }

    /**
     * Montant encaissé net : paiements encaissés moins remboursements (hors brouillons).
     */
    public function paid(Booking $booking): float
    {
        return round((float) Payment::where('id_reservation', $booking->id)->confirmed()->sum('montant_paiement'), 2);
    }

    /**
     * Montant qui peut encore être remboursé. Pour une réservation directe validée,
     * seul le trop-perçu l'est : rembourser davantage ferait réapparaître un solde à payer.
     */
    public function refundable(Booking $booking): float
    {
        $paid = $this->paid($booking);

        return max(0, $this->expectsBalance($booking) ? round($paid - $booking->prix_total, 2) : $paid);
    }

    /**
     * À appeler dans une transaction, après l'enregistrement ou la suppression d'un paiement :
     * les remboursements ne peuvent pas dépasser les sommes encaissées, ni créer un solde
     * à payer sur un séjour maintenu (il faut d'abord baisser son prix).
     */
    public function ensureRefundsCovered(Booking $booking, ?Payment $saved = null): void
    {
        if ($this->paid($booking) < 0) {
            throw new BusinessException(__('booking.refunds_exceed_paid'));
        }

        if ($saved?->isRefund() && $this->expectsBalance($booking) && $this->balance($booking) > 0) {
            throw new BusinessException(__('booking.refund_leaves_balance'));
        }
    }

    /**
     * Solde restant : prix total moins les paiements encaissés (hors brouillons).
     */
    public function balance(Booking $booking): float
    {
        return round($booking->prix_total - $this->paid($booking), 2);
    }

    /**
     * Seule une réservation directe validée attend un solde (paiement brouillon).
     */
    private function expectsBalance(Booking $booking): bool
    {
        return $booking->type === BookingType::Classique && $booking->statut === BookingStatus::Validated;
    }

    /**
     * Arrivée dans moins de « balance_due_days + 1 » jours : le solde serait déjà dû,
     * la totalité du séjour est donc demandée à la réservation.
     */
    public function requiresFullPayment(Booking $booking): bool
    {
        return today()->diffInDays($booking->date_arrivee, false) <= (int) $this->settings->get('balance_due_days');
    }

    /**
     * Montant demandé à la réservation : l'acompte, ou la totalité si l'arrivée est proche.
     */
    public function amountDueAtBooking(Booking $booking): float
    {
        return $this->requiresFullPayment($booking)
            ? (float) $booking->prix_total
            : round($booking->prix_total * (int) $this->settings->get('deposit_percent') / 100, 2);
    }

    /**
     * Échéance du solde : X jours avant l'arrivée, au plus tôt aujourd'hui.
     */
    public function balanceDueDate(Booking $booking): CarbonImmutable
    {
        $due = CarbonImmutable::parse($booking->date_arrivee)->subDays((int) $this->settings->get('balance_due_days'));

        return $due->max(today()->toImmutable());
    }

    /**
     * La taxe de séjour n'est comprise que dans les réservations directes :
     * les plateformes la collectent elles-mêmes.
     */
    private function touristTaxFor(BookingType $type, Quote $quote, array $data): float
    {
        if ($type !== BookingType::Classique) {
            return 0;
        }

        return isset($data['touristTax']) ? (float) $data['touristTax'] : $quote->touristTax;
    }

    private function ensureStayAllowed(string $checkIn, string $checkOut, int $nights): void
    {
        $minimum = (int) $this->settings->get('minimum_nights');
        if ($nights < $minimum) {
            throw new BusinessException(__('booking.minimum_nights', ['nights' => $minimum]));
        }

        foreach ($this->settings->get('minimum_stay_periods') as $period) {
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
