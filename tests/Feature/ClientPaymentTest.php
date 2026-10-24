<?php

use App\Models\Booking;
use App\Models\Client;
use App\Models\Payment;

it('liste les clients avec leurs types de réservation', function () {
    Booking::factory()->withClient(['nom' => 'Avec'])->create(['type' => 'AirBnb']);
    Client::factory()->create(['nom' => 'Sans']);

    $clients = $this->actingAs(admin())->getJson('/api/clients')->assertOk()->json('clients');

    expect(collect($clients)->firstWhere('nom', 'Avec'))
        ->can_delete->toEqual(0)
        ->types_reservations->toBe('AirBnb')
        ->and(collect($clients)->firstWhere('nom', 'Sans')['can_delete'])->toEqual(1);
});

it('affiche la fiche d’un client avec ses réservations et paiements', function () {
    $booking = Booking::factory()->withClient()->create();
    Payment::factory()->for($booking)->create(['montant_paiement' => 80]);
    $client = $booking->primaryClient();

    $this->actingAs(admin())->getJson("/api/clients/{$client->id}")
        ->assertOk()
        ->assertJsonPath('client.id', $client->id)
        ->assertJsonCount(1, 'client.bookings')
        ->assertJsonPath('client.payments.0.montant_paiement', '80.00')
        ->assertJsonMissingPath('client.bookings.0.pivot');
});

it('met à jour un client', function () {
    $client = Client::factory()->create();

    $this->actingAs(admin())->putJson("/api/clients/{$client->id}", [
        'name' => 'Martin', 'firstName' => 'Léa', 'email' => 'lea@example.com',
        'phone' => '0690', 'address' => 'Grand-Bourg', 'note' => 'Fidèle',
    ])->assertOk()->assertJsonPath('clientId', $client->id);

    expect($client->fresh())->nom->toBe('Martin')->note->toBe('Fidèle');
});

it('refuse de supprimer un client qui a des réservations', function () {
    $booking = Booking::factory()->withClient()->create();
    $client = $booking->primaryClient();

    $this->actingAs(admin())->deleteJson("/api/clients/{$client->id}")
        ->assertUnprocessable()
        ->assertJsonPath('message', __('booking.client_has_bookings'));

    $lonely = Client::factory()->create();
    $this->actingAs(admin())->deleteJson("/api/clients/{$lonely->id}")->assertOk();
    expect(Client::find($lonely->id))->toBeNull();
});

it('crée, modifie, liste et supprime un paiement', function () {
    $admin = admin();
    $booking = Booking::factory()->withClient(['nom' => 'Dupont'])->create();

    $id = $this->actingAs($admin)->postJson('/api/payments', [
        'booking' => $booking->id, 'deposit' => 150, 'date' => '2026-10-01', 'type' => 'espèces',
    ])->assertCreated()->json('paymentId');

    $this->actingAs($admin)->putJson("/api/payments/{$id}", [
        'booking' => $booking->id, 'deposit' => 175.5, 'date' => '2026-10-02', 'type' => 'chèque', 'note' => 'Solde',
    ])->assertOk();

    $this->actingAs($admin)->getJson('/api/payments')
        ->assertOk()
        ->assertJsonPath('payments.0.nom', 'Dupont')
        ->assertJsonPath('payments.0.montant_paiement', '175.50')
        ->assertJsonPath('payments.0.moyen_paiement', 'chèque');

    $this->actingAs($admin)->deleteJson("/api/payments/{$id}")->assertOk();
    expect(Payment::count())->toBe(0);
});

it('refuse un paiement sur une réservation inexistante ou un moyen inconnu', function () {
    $this->actingAs(admin())->postJson('/api/payments', [
        'booking' => 999, 'deposit' => 10, 'date' => '2026-10-01', 'type' => 'bitcoin',
    ])->assertUnprocessable()->assertJsonValidationErrors(['booking', 'type']);
});
