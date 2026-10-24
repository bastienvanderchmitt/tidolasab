<?php

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Mail\AdminNewBooking;
use App\Mail\BookingReceived;
use App\Mail\BookingValidated;
use App\Models\Booking;
use App\Models\Client;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    Carbon::setTestNow('2026-10-24');
});

function bookingPayload(array $overrides = []): array
{
    return array_merge([
        'checkIn' => '2026-12-01',
        'checkOut' => '2026-12-04',
        'adults' => 2,
        'children' => 1,
        'name' => 'Dupont',
        'firstName' => 'Marie',
        'email' => 'marie@example.com',
        'phone' => '0690112233',
        'address' => '1 rue des Palmiers',
        'postalCode' => '97140',
        'city' => 'Capesterre',
        'country' => 'France',
        'language' => 'fr',
    ], $overrides);
}

it('enregistre une réservation publique au prix calculé par le serveur', function () {
    $response = $this->postJson('/api/bookings', bookingPayload([
        'total' => 1,                // ignoré
        'type' => 'Fermeture',       // ignoré
        'isAdmin' => true,           // ignoré
    ]))->assertCreated();

    $booking = Booking::findOrFail($response->json('bookingId'));
    expect($booking)
        ->prix_total->toEqual('342.00')
        ->type->toBe(BookingType::Classique)
        ->statut->toBe(BookingStatus::Pending)
        ->nombre_nuits->toBe(3);

    expect($booking->primaryClient())
        ->email->toBe('marie@example.com')
        ->adresse->toBe('1 rue des Palmiers, 97140 Capesterre, France');

    Mail::assertSent(BookingReceived::class, fn ($mail) => $mail->hasTo('marie@example.com')
        && $mail->locale === 'fr'
        && count($mail->attachments()) === 2);
    Mail::assertSent(AdminNewBooking::class, fn ($mail) => $mail->hasTo(config('tidolasab.admin_email')));
});

it('refuse des dates qui chevauchent une réservation validée', function (string $checkIn, string $checkOut) {
    Booking::factory()->between('2026-12-10', '2026-12-15')->validated()->create();

    $this->postJson('/api/bookings', bookingPayload(['checkIn' => $checkIn, 'checkOut' => $checkOut]))
        ->assertUnprocessable()
        ->assertJsonPath('message', __('booking.dates_unavailable'));
})->with([
    'à cheval sur l’arrivée' => ['2026-12-08', '2026-12-11'],
    'à cheval sur le départ' => ['2026-12-14', '2026-12-17'],
    'à l’intérieur' => ['2026-12-11', '2026-12-13'],
    'qui englobe' => ['2026-12-08', '2026-12-17'],
]);

it('accepte une arrivée le jour d’un départ', function () {
    Booking::factory()->between('2026-12-10', '2026-12-15')->validated()->create();

    $this->postJson('/api/bookings', bookingPayload(['checkIn' => '2026-12-15', 'checkOut' => '2026-12-18']))
        ->assertCreated();
});

it('ne bloque pas les dates d’une réservation en attente ou annulée', function () {
    Booking::factory()->between('2026-12-10', '2026-12-15')->create();
    Booking::factory()->between('2026-12-10', '2026-12-15')->state(['statut' => BookingStatus::Cancelled])->create();

    $this->postJson('/api/bookings', bookingPayload(['checkIn' => '2026-12-10', 'checkOut' => '2026-12-13']))
        ->assertCreated();
});

it('impose les durées minimales de séjour', function () {
    $this->postJson('/api/bookings', bookingPayload(['checkIn' => '2026-12-01', 'checkOut' => '2026-12-02']))
        ->assertUnprocessable();

    // Noël / Nouvel an : 4 nuits minimum, même si le séjour déborde de la période
    $this->postJson('/api/bookings', bookingPayload(['checkIn' => '2026-12-19', 'checkOut' => '2026-12-22']))
        ->assertUnprocessable();

    $this->postJson('/api/bookings', bookingPayload(['checkIn' => '2026-12-22', 'checkOut' => '2026-12-26']))
        ->assertCreated();
});

it('valide les champs du formulaire public', function () {
    $this->postJson('/api/bookings', bookingPayload(['email' => 'pas-un-email', 'checkIn' => '2020-01-01']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'checkIn']);
});

it('permet à l’admin de saisir une réservation externe à son prix', function () {
    $response = $this->actingAs(admin())->postJson('/api/bookings', bookingPayload([
        'type' => 'AirBnb',
        'total' => 500,
        'email' => null,
    ]))->assertCreated();

    expect(Booking::find($response->json('bookingId')))
        ->prix_total->toEqual('500.00')
        ->type->toBe(BookingType::AirBnb);

    Mail::assertNotSent(BookingReceived::class);
    Mail::assertSent(AdminNewBooking::class);
});

it('enregistre une fermeture validée, gratuite et sans client', function () {
    $response = $this->actingAs(admin())->postJson('/api/bookings', [
        'checkIn' => '2026-12-01',
        'checkOut' => '2026-12-02',
        'adults' => 1,
        'type' => 'Fermeture',
        'total' => 300,
    ])->assertCreated();

    $booking = Booking::find($response->json('bookingId'));
    expect($booking)
        ->statut->toBe(BookingStatus::Validated)
        ->prix_total->toEqual('0.00')
        ->and($booking->clients)->toBeEmpty();

    Mail::assertNothingSent();
});

it('n’expose que les dates sur le calendrier public', function () {
    Booking::factory()->validated()->create(['note' => 'confidentiel']);
    Booking::factory()->state(['statut' => BookingStatus::Cancelled])->create();

    $this->getJson('/api/bookings/reserved')
        ->assertOk()
        ->assertJsonCount(1, 'bookings')
        ->assertExactJsonStructure(['bookings' => [['date_arrivee', 'date_depart']]]);
});

it('valide une réservation, enregistre l’acompte et prévient le client', function () {
    $booking = Booking::factory()->between('2026-12-01', '2026-12-04')->withClient(['email' => 'client@example.com'])->create();

    $this->actingAs(admin())
        ->postJson("/api/bookings/{$booking->id}/validate", ['deposit' => 171, 'date' => '2026-10-24', 'type' => 'virement'])
        ->assertOk()
        ->assertJson(['success' => true]);

    expect($booking->fresh()->statut)->toBe(BookingStatus::Validated)
        ->and($booking->payments()->confirmed()->sum('montant_paiement'))->toEqual(171);

    Mail::assertSent(BookingValidated::class, fn ($mail) => $mail->hasTo('client@example.com')
        && $mail->balance === 171.0
        && $mail->balanceDueDate->toDateString() === '2026-11-17');
});

it('refuse de valider une réservation sur des dates déjà prises', function () {
    Booking::factory()->between('2026-12-01', '2026-12-04')->validated()->create();
    $pending = Booking::factory()->between('2026-12-02', '2026-12-05')->create();

    $this->actingAs(admin())
        ->postJson("/api/bookings/{$pending->id}/validate", ['deposit' => 100, 'date' => '2026-10-24', 'type' => 'virement'])
        ->assertUnprocessable();

    expect($pending->fresh()->statut)->toBe(BookingStatus::Pending)
        ->and($pending->payments()->count())->toBe(0);
});

it('modifie, annule, remet en attente et supprime une réservation', function () {
    $admin = admin();
    $booking = Booking::factory()->withClient()->create();

    $this->actingAs($admin)->putJson("/api/bookings/{$booking->id}", [
        'checkIn' => '2026-11-10', 'checkOut' => '2026-11-14', 'adults' => 3, 'children' => 0,
        'type' => 'Booking', 'total' => 420, 'note' => 'Arrivée tardive',
    ])->assertOk();

    expect($booking->fresh())
        ->nombre_nuits->toBe(4)
        ->prix_total->toEqual('420.00')
        ->note->toBe('Arrivée tardive');

    $this->actingAs($admin)->postJson("/api/bookings/{$booking->id}/cancel")->assertOk();
    expect($booking->fresh()->statut)->toBe(BookingStatus::Cancelled);

    $this->actingAs($admin)->postJson("/api/bookings/{$booking->id}/pending")->assertOk();
    expect($booking->fresh()->statut)->toBe(BookingStatus::Pending);

    $this->actingAs($admin)->deleteJson("/api/bookings/{$booking->id}")->assertOk();
    expect(Booking::find($booking->id))->toBeNull()
        ->and(DB::table('reservations_clients')->where('id_reservation', $booking->id)->exists())->toBeFalse();
});

it('garde la réservation si l’envoi d’un email échoue', function () {
    Mail::shouldReceive('to')->andThrow(new RuntimeException('SMTP indisponible'));

    $this->postJson('/api/bookings', bookingPayload())->assertCreated();

    expect(Booking::count())->toBe(1);
});

it('renvoie une erreur 404 en JSON pour une réservation inconnue', function () {
    $this->actingAs(admin())->postJson('/api/bookings/999/cancel')
        ->assertNotFound()
        ->assertJsonPath('message', __('errors.not_found'));
});

it('liste les réservations avec le nom du client', function () {
    Booking::factory()->withClient(['nom' => 'Dupont', 'prenom' => 'Marie'])->create();

    $this->actingAs(admin())->getJson('/api/bookings')
        ->assertOk()
        ->assertJsonPath('bookings.0.nom_client', 'Dupont Marie');

    expect(Client::count())->toBe(1);
});
