<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\BusinessException;
use App\Http\Controllers\Controller;
use App\Http\Requests\ConfirmPaymentRequest;
use App\Http\Requests\SavePaymentRequest;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function __construct(private readonly BookingService $bookings) {}

    public function index(): JsonResponse
    {
        $payments = Payment::query()
            ->select('c.nom', 'c.prenom', 'paiements.*', 'r.date_arrivee', 'r.date_depart', 'r.type as type_reservation', 'r.statut as statut_reservation', 'r.prix_total', 'r.taxe_sejour', 'rc.id_client')
            ->leftJoin('reservations as r', 'r.id', '=', 'paiements.id_reservation')
            ->leftJoin('reservations_clients as rc', 'rc.id_reservation', '=', 'r.id')
            ->leftJoin('clients as c', 'c.id', '=', 'rc.id_client')
            ->orderByDesc('date_paiement')
            ->get();

        return response()->json(['payments' => $payments]);
    }

    /**
     * Enregistre un paiement encaissé, ou un remboursement (montant négatif) ;
     * le solde attendu de la réservation est recalculé.
     */
    public function store(SavePaymentRequest $request): JsonResponse
    {
        $payment = DB::transaction(function () use ($request) {
            $payment = Payment::create($this->attributes($request));
            $this->bookings->ensureRefundsCovered($payment->booking, $payment);
            $this->bookings->syncBalanceDraft($payment->booking);

            return $payment;
        });

        return response()->json(['paymentId' => $payment->id], 201);
    }

    /**
     * Pour un brouillon, seuls l'échéance, le moyen de paiement et la note sont modifiables :
     * son montant suit le prix de la réservation.
     */
    public function update(SavePaymentRequest $request, Payment $payment): JsonResponse
    {
        DB::transaction(function () use ($request, $payment) {
            $previousBooking = $payment->booking;

            $attributes = $this->attributes($request);
            if ($payment->isDraft()) {
                $attributes = array_intersect_key($attributes, array_flip(['date_paiement', 'moyen_paiement', 'note']));
            }
            $payment->update($attributes);
            $booking = $payment->fresh()->booking;

            $this->bookings->ensureRefundsCovered($booking, $payment);
            $this->bookings->syncBalanceDraft($booking);
            if ($previousBooking && $previousBooking->id !== $payment->id_reservation) {
                $this->bookings->ensureRefundsCovered($previousBooking);
                $this->bookings->syncBalanceDraft($previousBooking);
            }
        });

        return response()->json(['paymentId' => $payment->id]);
    }

    public function confirm(ConfirmPaymentRequest $request, Payment $payment): JsonResponse
    {
        $this->bookings->confirmDraft(
            $payment,
            $request->filled('deposit') ? (float) $request->input('deposit') : null,
            $request->input('date'),
            $request->input('type'),
        );

        return response()->json(['paymentId' => $payment->id]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        if ($payment->isDraft()) {
            throw new BusinessException(__('booking.draft_not_deletable'));
        }

        DB::transaction(function () use ($payment) {
            $booking = $payment->booking;
            $payment->delete();
            if ($booking instanceof Booking) {
                $this->bookings->ensureRefundsCovered($booking);
                $this->bookings->syncBalanceDraft($booking);
            }
        });

        return response()->json(['success' => true]);
    }

    private function attributes(SavePaymentRequest $request): array
    {
        return [
            'id_reservation' => $request->integer('booking'),
            'montant_paiement' => $request->input('deposit'),
            'date_paiement' => $request->input('date'),
            'moyen_paiement' => $request->input('type'),
            'note' => $request->input('note'),
        ];
    }
}
