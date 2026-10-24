<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Payment;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index(): JsonResponse
    {
        $byStatus = Booking::query()->select('statut', DB::raw('COUNT(*) as total'))->groupBy('statut')->pluck('total', 'statut');

        return response()->json(['statistics' => [
            'total_clients' => Client::count(),
            'total_reservations' => Booking::query()
                ->where('statut', '<>', BookingStatus::Cancelled)
                ->where('type', '<>', BookingType::Fermeture)
                ->count(),
            'total_paiements' => (float) Payment::sum('montant_paiement'),
            'reservations_a_venir' => $this->upcomingBookings(),
            'reservations_par_statut' => collect(BookingStatus::cases())
                ->map(fn (BookingStatus $status) => ['statut' => $status->value, 'total' => (int) ($byStatus[$status->value] ?? 0)])
                ->sortBy('statut')
                ->values(),
            'reservations_par_type' => Booking::query()->select('type', DB::raw('COUNT(*) as total'))->groupBy('type')->get(),
            'reservations_par_annee' => $this->bookingsByMonth(),
            'clients_par_annee' => $this->guestsByMonth(),
            'pourcentage_remplissage' => $this->occupancyRate(),
        ]]);
    }

    private function upcomingBookings(): Collection
    {
        return Booking::query()
            ->select('reservations.*')
            ->selectRaw("CONCAT(c.nom, ' ', c.prenom) as nom_client, c.id as id_client")
            ->leftJoin('reservations_clients as rc', 'rc.id_reservation', '=', 'reservations.id')
            ->leftJoin('clients as c', 'c.id', '=', 'rc.id_client')
            ->where('date_arrivee', '>=', today())
            ->where('statut', BookingStatus::Validated)
            ->orderBy('date_arrivee')
            ->get();
    }

    /**
     * Nombre de réservations par type et par mois d'arrivée.
     */
    private function bookingsByMonth(): array
    {
        $counts = Booking::query()
            ->selectRaw("DATE_FORMAT(date_arrivee, '%Y-%m') as mois, type, COUNT(*) as total")
            ->where('date_arrivee', '<=', today()->endOfMonth())
            ->groupBy('mois', 'type')
            ->toBase()
            ->get();

        // Tous les mois du premier mois réservé jusqu'au mois courant
        $months = collect();
        if ($counts->isNotEmpty()) {
            $month = CarbonImmutable::parse($counts->min('mois').'-01');
            while ($month <= today()) {
                $months->push($month->format('Y-m'));
                $month = $month->addMonth();
            }
        }

        return [
            'mois' => $months->values(),
            'series' => collect(['AirBnb', 'Booking', 'Classique', 'Fermeture'])->map(fn (string $type) => [
                'name' => $type,
                'data' => $months->map(fn (string $month) => (int) ($counts->first(
                    fn ($row) => $row->mois === $month && $row->type === $type
                )?->total ?? 0))->values(),
            ]),
        ];
    }

    private function guestsByMonth(): array
    {
        $rows = Booking::query()
            ->selectRaw("DATE_FORMAT(date_arrivee, '%Y-%m') as mois, SUM(nombre_nuits) as total_nuits, SUM(adultes) as total_adultes")
            ->groupBy('mois')
            ->orderBy('mois')
            ->toBase()
            ->get();

        return [
            'mois' => $rows->pluck('mois'),
            'series' => [
                ['name' => 'Nuits', 'data' => $rows->pluck('total_nuits')->map(fn ($v) => (int) $v)],
                ['name' => 'Adultes', 'data' => $rows->pluck('total_adultes')->map(fn ($v) => (int) $v)],
            ],
        ];
    }

    /**
     * Part des nuits réservées sur les 6 prochains mois.
     */
    private function occupancyRate(): float
    {
        $start = today()->toImmutable();
        $end = $start->addMonths(6);
        $availableNights = $start->diffInDays($end);

        $bookedNights = Booking::query()
            ->where('statut', '<>', BookingStatus::Cancelled)
            ->where('date_arrivee', '<', $end)
            ->where('date_depart', '>', $start)
            ->get(['date_arrivee', 'date_depart'])
            ->sum(fn (Booking $booking) => max($booking->date_arrivee, $start)->diffInDays(min($booking->date_depart, $end)));

        return $availableNights > 0 ? round($bookedNights / $availableNights * 100, 2) : 0.0;
    }
}
