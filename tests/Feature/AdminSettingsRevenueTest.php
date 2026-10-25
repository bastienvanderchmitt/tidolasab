<?php

use App\Enums\PaymentStatus;
use App\Mail\BookingReceived;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    Carbon::setTestNow('2026-10-24');
});

function validSettings(array $overrides = []): array
{
    return array_merge([
        'rates' => [['from_year' => 0, 'low' => 100, 'high' => 110], ['from_year' => 2027, 'low' => 105, 'high' => 115]],
        'low_season_months' => [9, 10],
        'tourist_tax' => 2,
        'discount_nights_threshold' => 7,
        'minimum_nights' => 2,
        'minimum_stay_periods' => [['start' => '2026-12-21', 'end' => '2027-01-06', 'nights' => 4]],
        'deposit_percent' => 50,
        'balance_due_days' => 14,
    ], $overrides);
}

describe('réglages', function () {
    it('renvoie les valeurs par défaut de la configuration', function () {
        $this->actingAs(admin())->getJson('/api/settings')
            ->assertOk()
            ->assertJsonPath('settings.tourist_tax', 2)
            ->assertJsonPath('settings.deposit_percent', 50)
            ->assertJsonCount(2, 'settings.rates');
    });

    it('applique immédiatement les nouveaux tarifs au site public', function () {
        $this->actingAs(admin())->putJson('/api/settings', validSettings([
            'rates' => [['from_year' => 0, 'low' => 90, 'high' => 120]],
            'low_season_months' => [6, 9, 10],
            'tourist_tax' => 1.5,
        ]))->assertOk()->assertJsonPath('settings.tourist_tax', 1.5);

        $this->getJson('/api/pricing')
            ->assertJsonPath('pricing.rates.0.high', 120)
            ->assertJsonPath('pricing.low_season_months', [6, 9, 10]);

        // 3 nuits de décembre à 120 € + 3 x 2 adultes x 1,50 €
        $this->getJson('/api/pricing/quote?checkIn=2026-12-01&checkOut=2026-12-04&adults=2')
            ->assertJsonPath('quote.total', 369);
    });

    it('n’impacte pas le prix des réservations existantes', function () {
        $booking = Booking::factory()->create(['prix_total' => 342]);

        $this->actingAs(admin())->putJson('/api/settings', validSettings([
            'rates' => [['from_year' => 0, 'low' => 200, 'high' => 300]],
        ]))->assertOk();

        expect($booking->fresh()->prix_total)->toEqual('342.00');
    });

    it('applique les nouvelles durées minimales et le nouvel acompte', function () {
        $this->actingAs(admin())->putJson('/api/settings', validSettings([
            'minimum_nights' => 3,
            'deposit_percent' => 30,
            'minimum_stay_periods' => [],
        ]))->assertOk();
        auth()->forgetGuards();

        $payload = [
            'checkIn' => '2026-12-01', 'adults' => 2, 'name' => 'D', 'firstName' => 'M', 'email' => 'm@example.com',
            'phone' => '0690112233', 'address' => '1 rue des Palmiers', 'postalCode' => '97140', 'city' => 'Capesterre', 'country' => 'France',
        ];

        $this->postJson('/api/bookings', [...$payload, 'checkOut' => '2026-12-03'])->assertUnprocessable();
        $this->postJson('/api/bookings', [...$payload, 'checkOut' => '2026-12-04'])->assertCreated();

        Mail::assertQueued(BookingReceived::class, fn ($mail) => $mail->amountDue === round(342 * 0.3, 2));
    });

    it('désactive la remise semaine avec 0', function () {
        $this->actingAs(admin())->putJson('/api/settings', validSettings(['discount_nights_threshold' => 0]))->assertOk();

        $this->getJson('/api/pricing/quote?checkIn=2026-09-01&checkOut=2026-09-08&adults=1')
            ->assertJsonPath('quote.discount', 0);
    });

    it('valide les réglages', function () {
        $this->actingAs(admin())->putJson('/api/settings', validSettings([
            'rates' => [['from_year' => 2027, 'low' => 100, 'high' => 110], ['from_year' => 2027, 'low' => -1, 'high' => 110]],
            'low_season_months' => [13],
            'deposit_percent' => 120,
            'minimum_stay_periods' => [['start' => '2027-01-06', 'end' => '2026-12-21', 'nights' => 4]],
        ]))->assertUnprocessable()->assertJsonValidationErrors([
            'rates.1.from_year', 'rates.1.low', 'low_season_months.0', 'deposit_percent', 'minimum_stay_periods.0.end',
        ]);
    });
});

describe('chiffre d’affaires', function () {
    beforeEach(function () {
        // Séjour de janvier 2027 : acompte payé en 2026, solde en brouillon pour 2027
        $direct = Booking::factory()->between('2027-01-10', '2027-01-14')->validated()->withClient()
            ->create(['prix_total' => 400, 'taxe_sejour' => 16]);
        Payment::factory()->for($direct)->create(['montant_paiement' => 200, 'date_paiement' => '2026-10-01']);
        Payment::factory()->for($direct)->create(['montant_paiement' => 200, 'date_paiement' => '2026-12-27', 'statut' => PaymentStatus::Draft]);

        // Réservation AirBnb : versement en 2026, taxe collectée par la plateforme
        $airbnb = Booking::factory()->between('2026-08-01', '2026-08-05')->validated()->withClient()
            ->create(['type' => 'AirBnb', 'prix_total' => 500, 'taxe_sejour' => 0]);
        Payment::factory()->for($airbnb)->create(['montant_paiement' => 450, 'date_paiement' => '2026-08-06']);
    });

    it('compte les paiements dans l’année du séjour', function () {
        $years = collect($this->actingAs(admin())->getJson('/api/revenue?basis=stay')->assertOk()->json('revenue.years'))->keyBy('year');

        expect($years[2027])->toMatchArray([
            'confirmed' => 200, 'draft' => 200, 'tax_confirmed' => 8, 'tax_draft' => 8,
        ])->and($years[2027]['months'][0]['confirmed'])->toEqual(200)
            ->and($years[2026])->toMatchArray(['confirmed' => 450, 'draft' => 0, 'tax_confirmed' => 0])
            ->and($years[2026]['by_type']['AirBnb']['confirmed'])->toEqual(450);
    });

    it('compte les paiements dans l’année de leur encaissement', function () {
        $years = collect($this->actingAs(admin())->getJson('/api/revenue?basis=payment')->assertOk()->json('revenue.years'))->keyBy('year');

        expect($years->keys()->all())->toBe([2026])
            ->and($years[2026])->toMatchArray(['confirmed' => 650, 'draft' => 200, 'tax_confirmed' => 8, 'tax_draft' => 8])
            ->and($years[2026]['months'][11]['draft'])->toEqual(200);
    });

    it('refuse une base de calcul inconnue', function () {
        $this->actingAs(admin())->getJson('/api/revenue?basis=autre')->assertUnprocessable();
    });
});

it('liste ce qui demande une action sur le tableau de bord', function () {
    Booking::factory()->between('2026-12-01', '2026-12-04')->withClient(['nom' => 'Attente'])->create(['prix_total' => 342]);
    $validated = Booking::factory()->between('2026-11-01', '2026-11-05')->validated()->withClient(['nom' => 'Valide'])->create(['prix_total' => 400]);
    Payment::factory()->for($validated)->create(['montant_paiement' => 200, 'date_paiement' => '2026-10-18', 'statut' => PaymentStatus::Draft]);

    $dashboard = $this->actingAs(admin())->getJson('/api/dashboard')->assertOk()->json('dashboard');

    expect($dashboard['pending_bookings'])->toHaveCount(1)
        ->and($dashboard['pending_bookings'][0]['acompte_attendu'])->toEqual(171)
        ->and($dashboard['upcoming_arrivals'][0]['nom_client'])->toStartWith('Valide')
        ->and($dashboard['drafts'][0]['montant_paiement'])->toBe('200.00')
        ->and($dashboard['bookings_this_year'])->toBe(2);
});

it('gère les comptes administrateurs', function () {
    $me = admin();
    $other = User::factory()->create(['name' => 'Isabelle']);

    $this->actingAs($me)->getJson('/api/users')->assertOk()->assertJsonCount(2, 'users')->assertJsonMissingPath('users.0.password');
    $this->actingAs($me)->deleteJson("/api/users/{$me->id}")->assertUnprocessable();
    $this->actingAs($me)->deleteJson("/api/users/{$other->id}")->assertOk();

    expect(User::count())->toBe(1);
});

it('renvoie le détail d’une réservation avec client et paiements', function () {
    $booking = Booking::factory()->withClient(['nom' => 'Dupont'])->create();
    Payment::factory()->for($booking)->create();

    $this->actingAs(admin())->getJson("/api/bookings/{$booking->id}")
        ->assertOk()
        ->assertJsonPath('booking.clients.0.nom', 'Dupont')
        ->assertJsonCount(1, 'booking.payments')
        ->assertJsonMissingPath('booking.clients.0.pivot');
});
