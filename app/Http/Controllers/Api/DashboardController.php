<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Payment;
use App\Services\BookingService;
use App\Services\RevenueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;

class DashboardController extends Controller
{
    public function __construct(private readonly BookingService $bookings) {}

    /**
     * Ce qui demande une action : réservations à valider, paiements attendus, prochaines arrivées.
     */
    public function index(): JsonResponse
    {
        return response()->json(['dashboard' => [
            'pending_bookings' => $this->withClient(
                Booking::query()->where('statut', BookingStatus::Pending)->orderBy('date_arrivee')
            )->each(function (Booking $booking) {
                foreach ($this->bookings->paymentTerms($booking) as $key => $value) {
                    $booking->setAttribute($key, $value);
                }
            }),
            'upcoming_arrivals' => $this->withClient(
                Booking::query()
                    ->where('statut', BookingStatus::Validated)
                    ->where('type', '<>', BookingType::Fermeture)
                    ->whereDate('date_depart', '>=', today())
                    ->orderBy('date_arrivee')
                    ->limit(8)
            ),
            'drafts' => Payment::query()
                ->draft()
                ->select('paiements.*', 'r.date_arrivee', 'r.type as type_reservation', 'rc.id_client')
                ->selectRaw("CONCAT(c.nom, ' ', c.prenom) as nom_client")
                ->join('reservations as r', 'r.id', '=', 'paiements.id_reservation')
                ->leftJoin('reservations_clients as rc', 'rc.id_reservation', '=', 'r.id')
                ->leftJoin('clients as c', 'c.id', '=', 'rc.id_client')
                ->orderBy('date_paiement')
                ->get(),
            'occupancy_rate' => $this->occupancyRate(),
            'bookings_this_year' => Booking::query()
                ->whereYear('date_arrivee', today()->year)
                ->where('statut', '<>', BookingStatus::Cancelled)
                ->where('type', '<>', BookingType::Fermeture)
                ->count(),
            'total_clients' => Client::count(),
        ]]);
    }

    public function revenue(Request $request, RevenueService $revenue): JsonResponse
    {
        $basis = $request->validate([
            'basis' => ['nullable', Rule::in(RevenueService::BASES)],
        ])['basis'] ?? 'stay';

        return response()->json(['revenue' => [
            'basis' => $basis,
            'years' => $revenue->byYear($basis),
        ]]);
    }

    private function withClient($query): Collection
    {
        return $query
            ->select('reservations.*', 'rc.id_client')
            ->selectRaw("CONCAT(c.nom, ' ', c.prenom) as nom_client")
            ->selectRaw("(SELECT COALESCE(SUM(p.montant_paiement), 0) FROM paiements p WHERE p.id_reservation = reservations.id AND p.statut = 'confirmé') as total_paye")
            ->leftJoin('reservations_clients as rc', 'rc.id_reservation', '=', 'reservations.id')
            ->leftJoin('clients as c', 'c.id', '=', 'rc.id_client')
            ->get();
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
