<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Requests\ValidateBookingRequest;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    public function __construct(private readonly BookingService $bookings) {}

    /**
     * Dates occupées, pour le calendrier public.
     */
    public function reserved(): JsonResponse
    {
        $bookings = Booking::query()
            ->where('statut', '<>', BookingStatus::Cancelled)
            ->orderBy('date_arrivee')
            ->get(['date_arrivee', 'date_depart']);

        return response()->json(['bookings' => $bookings]);
    }

    public function index(): JsonResponse
    {
        $bookings = Booking::query()
            ->select('reservations.*', 'rc.id_client')
            ->selectRaw("CONCAT(c.nom, ' ', c.prenom) as nom_client")
            ->selectRaw("(SELECT COALESCE(SUM(p.montant_paiement), 0) FROM paiements p WHERE p.id_reservation = reservations.id AND p.statut = 'confirmé') as total_paye")
            ->selectRaw("(SELECT COALESCE(SUM(p.montant_paiement), 0) FROM paiements p WHERE p.id_reservation = reservations.id AND p.statut = 'brouillon') as total_brouillon")
            ->leftJoin('reservations_clients as rc', 'rc.id_reservation', '=', 'reservations.id')
            ->leftJoin('clients as c', 'c.id', '=', 'rc.id_client')
            ->orderByDesc('date_arrivee')
            ->get()
            ->each(fn (Booking $booking) => $this->appendPaymentTerms($booking));

        return response()->json(['bookings' => $bookings]);
    }

    public function show(Booking $booking): JsonResponse
    {
        $booking->load(['clients', 'payments' => fn ($query) => $query->orderBy('date_paiement')]);
        $booking->clients->each->makeHidden('pivot');
        $this->appendPaymentTerms($booking);

        return response()->json(['booking' => $booking]);
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $booking = $this->bookings->create($request->validated(), $request->user('sanctum') !== null);

        return response()->json(['bookingId' => $booking->id], 201);
    }

    public function update(UpdateBookingRequest $request, Booking $booking): JsonResponse
    {
        $this->bookings->update($booking, $request->validated());

        return response()->json(['bookingId' => $booking->id]);
    }

    public function validateBooking(ValidateBookingRequest $request, Booking $booking): JsonResponse
    {
        $this->bookings->validate(
            $booking,
            (float) $request->input('deposit'),
            $request->input('date'),
            $request->input('type'),
        );

        return response()->json(['success' => true]);
    }

    public function cancel(Booking $booking): JsonResponse
    {
        $this->bookings->cancel($booking);

        return response()->json(['success' => true]);
    }

    public function pending(Booking $booking): JsonResponse
    {
        $this->bookings->setPending($booking);

        return response()->json(['success' => true]);
    }

    /**
     * Montant à demander au client à la validation (acompte ou totalité si l'arrivée est proche).
     */
    private function appendPaymentTerms(Booking $booking): void
    {
        $booking->setAttribute('acompte_attendu', $this->bookings->amountDueAtBooking($booking));
        $booking->setAttribute('paiement_total_requis', $this->bookings->requiresFullPayment($booking));
    }

    public function destroy(Booking $booking): JsonResponse
    {
        $this->bookings->delete($booking);

        return response()->json(['success' => true]);
    }
}
