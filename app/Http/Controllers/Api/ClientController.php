<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\BusinessException;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        $clients = Client::query()
            ->select('clients.*')
            ->selectRaw('NOT EXISTS (SELECT 1 FROM reservations_clients rc WHERE rc.id_client = clients.id) as can_delete')
            ->selectRaw('(SELECT GROUP_CONCAT(DISTINCT r.type)
                            FROM reservations r
                            JOIN reservations_clients rc ON r.id = rc.id_reservation
                           WHERE rc.id_client = clients.id) as types_reservations')
            ->selectRaw('(SELECT COUNT(*) FROM reservations_clients rc WHERE rc.id_client = clients.id) as nombre_reservations')
            ->selectRaw('(SELECT MAX(r.date_arrivee)
                            FROM reservations r
                            JOIN reservations_clients rc ON r.id = rc.id_reservation
                           WHERE rc.id_client = clients.id) as dernier_sejour')
            ->selectRaw("(SELECT COALESCE(SUM(p.montant_paiement), 0)
                            FROM paiements p
                            JOIN reservations_clients rc ON p.id_reservation = rc.id_reservation
                           WHERE rc.id_client = clients.id AND p.statut = 'confirmé') as total_paye")
            ->orderByDesc('id')
            ->get();

        return response()->json(['clients' => $clients]);
    }

    public function show(Client $client): JsonResponse
    {
        $bookings = $client->bookings()->orderByDesc('date_arrivee')->get()->each->makeHidden('pivot');

        $client->setRelation('bookings', $bookings);
        $client->setRelation('payments', Payment::whereIn('id_reservation', $bookings->modelKeys())->orderByDesc('date_paiement')->get());

        return response()->json(['client' => $client]);
    }

    public function update(UpdateClientRequest $request, Client $client): JsonResponse
    {
        $client->update([
            'nom' => $request->input('name') ?? '',
            'prenom' => $request->input('firstName') ?? '',
            'email' => $request->input('email') ?? '',
            'telephone' => $request->input('phone') ?? '',
            'adresse' => $request->input('address') ?? '',
            'note' => $request->input('note'),
        ]);

        return response()->json(['clientId' => $client->id]);
    }

    public function destroy(Client $client): JsonResponse
    {
        if ($client->bookings()->exists()) {
            throw new BusinessException(__('booking.client_has_bookings'));
        }

        $client->delete();

        return response()->json(['success' => true]);
    }
}
