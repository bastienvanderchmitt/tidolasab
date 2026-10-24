<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SavePaymentRequest;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function index(): JsonResponse
    {
        $payments = Payment::query()
            ->select('c.nom', 'c.prenom', 'paiements.*', 'r.date_arrivee', 'r.date_depart', 'rc.id_client')
            ->selectRaw('(SELECT GROUP_CONCAT(DISTINCT r2.type)
                            FROM reservations r2
                            JOIN reservations_clients rc2 ON r2.id = rc2.id_reservation
                           WHERE rc2.id_client = c.id) as types_reservations')
            ->leftJoin('reservations as r', 'r.id', '=', 'paiements.id_reservation')
            ->leftJoin('reservations_clients as rc', 'rc.id_reservation', '=', 'r.id')
            ->leftJoin('clients as c', 'c.id', '=', 'rc.id_client')
            ->orderByDesc('date_paiement')
            ->get();

        return response()->json(['payments' => $payments]);
    }

    public function store(SavePaymentRequest $request): JsonResponse
    {
        $payment = Payment::create($this->attributes($request));

        return response()->json(['paymentId' => $payment->id], 201);
    }

    public function update(SavePaymentRequest $request, Payment $payment): JsonResponse
    {
        $payment->update($this->attributes($request));

        return response()->json(['paymentId' => $payment->id]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $payment->delete();

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
