<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Requests\ValidateBookingRequest;
use App\Models\Booking;
use App\Services\BookingService;
use App\Services\EmailVerification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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

    public function store(StoreBookingRequest $request, EmailVerification $verification): JsonResponse
    {
        $isAdmin = $request->user('sanctum') !== null;
        $data = $request->validated();

        // Côté public, l'adresse email est prouvée par le code reçu avant tout envoi du contrat
        if (! $isAdmin && ! $verification->check($data['email'], $data['verificationCode'] ?? null)) {
            throw ValidationException::withMessages(['verificationCode' => __('booking.code_invalid')]);
        }

        $booking = $this->bookings->create($data, $isAdmin);

        if (! $isAdmin) {
            $verification->forget($data['email']);
        }

        return response()->json(['bookingId' => $booking->id], 201);
    }

    public function sendVerificationCode(Request $request, EmailVerification $verification): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email:rfc,strict', 'max:255'],
            'language' => ['nullable', 'string', 'size:2'],
        ]);

        $verification->send($data['email'], ($data['language'] ?? 'fr') === 'fr' ? 'fr' : 'en');

        return response()->json([
            'expiresIn' => EmailVerification::TTL_MINUTES * 60,
            'resendIn' => EmailVerification::RESEND_SECONDS,
        ]);
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
            $request->input('dueDate'),
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

    private function appendPaymentTerms(Booking $booking): void
    {
        foreach ($this->bookings->paymentTerms($booking) as $key => $value) {
            $booking->setAttribute($key, $value);
        }
        $booking->setAttribute('remboursable', $this->bookings->refundable($booking));
    }

    public function destroy(Booking $booking): JsonResponse
    {
        $this->bookings->delete($booking);

        return response()->json(['success' => true]);
    }
}
