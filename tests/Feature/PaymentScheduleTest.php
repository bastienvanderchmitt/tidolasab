<?php

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Mail\BookingReceived;
use App\Mail\BookingValidated;
use App\Mail\PaymentReminder;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Payment;
use App\Support\Money;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    Carbon::setTestNow('2026-10-24');
});

function publicBooking(string $checkIn, string $checkOut): array
{
    return [
        'checkIn' => $checkIn, 'checkOut' => $checkOut, 'adults' => 2, 'children' => 0,
        'name' => 'Dupont', 'firstName' => 'Marie', 'email' => 'marie@example.com', 'phone' => '0690112233',
        'address' => '1 rue des Palmiers', 'postalCode' => '97140', 'city' => 'Capesterre', 'country' => 'France',
        'language' => 'fr',
    ];
}

function validateBooking(Booking $booking, float $deposit, string $date = '2026-10-24')
{
    return test()->actingAs(admin())->postJson("/api/bookings/{$booking->id}/validate", [
        'deposit' => $deposit, 'date' => $date, 'type' => 'virement',
    ]);
}

function draftOf(Booking $booking): ?Payment
{
    return $booking->payments()->draft()->first();
}

describe('premier email à la réservation', function () {
    it('demande un acompte de 50 % quand l’arrivée est dans plus de 14 jours', function () {
        $this->postJson('/api/bookings', publicBooking('2026-12-01', '2026-12-04'))->assertCreated();

        Mail::assertSent(BookingReceived::class, function (BookingReceived $mail) {
            $html = html_entity_decode($mail->render(), ENT_QUOTES);

            return ! $mail->fullPayment
                && $mail->amountDue === 171.0
                && str_contains($html, 'acompte de 50% (171 €)')
                && str_contains($html, 'Le solde restant vous sera demandé 14 jours avant l\'arrivée');
        });
    });

    it('demande la totalité quand l’arrivée est dans moins de 15 jours', function (string $checkIn, string $checkOut) {
        $this->postJson('/api/bookings', publicBooking($checkIn, $checkOut))->assertCreated();

        Mail::assertSent(BookingReceived::class, function (BookingReceived $mail) {
            $html = html_entity_decode($mail->render(), ENT_QUOTES);

            return $mail->fullPayment
                && $mail->amountDue === (float) $mail->booking->prix_total
                && str_contains($html, 'règlement de la totalité du séjour ('.Money::format($mail->booking->prix_total).' €)')
                && str_contains($html, 'moins de 15 jours')
                && ! str_contains($html, 'acompte');
        });
    })->with([
        'J-14' => ['2026-11-07', '2026-11-10'],
        'J-3' => ['2026-10-27', '2026-10-30'],
    ]);

    it('applique la règle à J-15 : acompte', function () {
        $this->postJson('/api/bookings', publicBooking('2026-11-08', '2026-11-11'))->assertCreated();

        Mail::assertSent(BookingReceived::class, fn (BookingReceived $mail) => ! $mail->fullPayment);
    });

    it('envoie l’email en anglais avec la même règle', function () {
        $this->postJson('/api/bookings', [...publicBooking('2026-10-27', '2026-10-30'), 'language' => 'en'])->assertCreated();

        Mail::assertSent(BookingReceived::class, fn (BookingReceived $mail) => $mail->locale === 'en'
            && str_contains($mail->render(), 'full amount of your stay'));
    });

    it('indique à l’admin et dans la liste que la totalité est demandée', function () {
        $this->postJson('/api/bookings', publicBooking('2026-10-27', '2026-10-30'))->assertCreated();

        $booking = $this->actingAs(admin())->getJson('/api/bookings')->json('bookings.0');

        expect($booking['paiement_total_requis'])->toBeTrue()
            ->and($booking['acompte_attendu'])->toEqual($booking['prix_total']);
    });
});

describe('paiement brouillon du solde', function () {
    it('crée le solde en brouillon à J-14 lors de la validation', function () {
        $booking = Booking::factory()->between('2026-12-01', '2026-12-04')->withClient()->create(['prix_total' => 342]);

        validateBooking($booking, 171)->assertOk();

        expect(draftOf($booking))
            ->montant_paiement->toEqual('171.00')
            ->date_paiement->toDateString()->toBe('2026-11-17')
            ->statut->toBe(PaymentStatus::Draft);
    });

    it('ne crée pas de brouillon quand tout est payé', function () {
        $booking = Booking::factory()->between('2026-10-27', '2026-10-30')->withClient()->create(['prix_total' => 342]);

        validateBooking($booking, 342)->assertOk();

        expect(draftOf($booking))->toBeNull();
        Mail::assertSent(BookingValidated::class, fn (BookingValidated $mail) => $mail->balance === 0.0
            && str_contains($mail->render(), 'intégralement réglé')
            && ! str_contains($mail->render(), 'Solde à régler'));
    });

    it('date le brouillon d’aujourd’hui quand l’échéance est passée', function () {
        $booking = Booking::factory()->between('2026-10-27', '2026-10-30')->withClient()->create(['prix_total' => 342]);

        validateBooking($booking, 100)->assertOk();

        expect(draftOf($booking)->date_paiement->toDateString())->toBe('2026-10-24');
    });

    it('ne crée pas de brouillon pour Booking et AirBnb', function () {
        $booking = Booking::factory()->withClient()->create(['type' => 'AirBnb', 'prix_total' => 500]);

        validateBooking($booking, 200)->assertOk();

        expect(draftOf($booking))->toBeNull();
    });

    it('encaisse un brouillon, en totalité ou en partie', function () {
        $booking = Booking::factory()->between('2026-12-01', '2026-12-04')->withClient()->create(['prix_total' => 342]);
        validateBooking($booking, 171);
        $draft = draftOf($booking);

        // Paiement partiel : un nouveau brouillon reprend le reste
        $this->actingAs(admin())->postJson("/api/payments/{$draft->id}/confirm", [
            'deposit' => 100, 'date' => '2026-11-15', 'type' => 'espèces',
        ])->assertOk();

        expect($draft->fresh())->statut->toBe(PaymentStatus::Confirmed)->montant_paiement->toEqual('100.00')
            ->and(draftOf($booking)->montant_paiement)->toEqual('71.00');

        // Paiement du reste au montant du brouillon
        $this->actingAs(admin())->postJson('/api/payments/'.draftOf($booking)->id.'/confirm', [
            'date' => '2026-11-16', 'type' => 'virement',
        ])->assertOk();

        expect(draftOf($booking))->toBeNull()
            ->and($booking->payments()->confirmed()->sum('montant_paiement'))->toEqual(342);
    });

    it('refuse d’encaisser deux fois le même paiement', function () {
        $payment = Payment::factory()->create();

        $this->actingAs(admin())->postJson("/api/payments/{$payment->id}/confirm", ['date' => '2026-10-24', 'type' => 'virement'])
            ->assertUnprocessable();
    });

    it('suit le prix de la réservation et les paiements encaissés', function () {
        $admin = admin();
        $booking = Booking::factory()->between('2026-12-01', '2026-12-04')->withClient()->create(['prix_total' => 342]);
        validateBooking($booking, 171);

        // Prix modifié : le solde suit
        $this->actingAs($admin)->putJson("/api/bookings/{$booking->id}", [
            'checkIn' => '2026-12-01', 'checkOut' => '2026-12-04', 'adults' => 2, 'type' => 'Classique', 'total' => 400,
        ])->assertOk();
        expect(draftOf($booking)->montant_paiement)->toEqual('229.00');

        // Paiement encaissé à part : le solde diminue
        $paymentId = $this->actingAs($admin)->postJson('/api/payments', [
            'booking' => $booking->id, 'deposit' => 29, 'date' => '2026-10-25', 'type' => 'espèces',
        ])->json('paymentId');
        expect(draftOf($booking)->montant_paiement)->toEqual('200.00');

        // Paiement supprimé : le solde remonte
        $this->actingAs($admin)->deleteJson("/api/payments/{$paymentId}")->assertOk();
        expect(draftOf($booking)->montant_paiement)->toEqual('229.00');
    });

    it('ne laisse modifier que l’échéance et la note d’un brouillon', function () {
        $booking = Booking::factory()->between('2026-12-01', '2026-12-04')->withClient()->create(['prix_total' => 342]);
        validateBooking($booking, 171);
        $draft = draftOf($booking);

        $this->actingAs(admin())->putJson("/api/payments/{$draft->id}", [
            'booking' => $booking->id, 'deposit' => 1, 'date' => '2026-11-20', 'type' => 'chèque', 'note' => 'Chèque promis',
        ])->assertOk();

        expect($draft->fresh())
            ->montant_paiement->toEqual('171.00')
            ->date_paiement->toDateString()->toBe('2026-11-20')
            ->note->toBe('Chèque promis');

        $this->actingAs(admin())->deleteJson("/api/payments/{$draft->id}")->assertUnprocessable();
    });

    it('supprime le brouillon si la réservation est annulée ou remise en attente', function (string $action) {
        $booking = Booking::factory()->between('2026-12-01', '2026-12-04')->withClient()->create(['prix_total' => 342]);
        validateBooking($booking, 171);

        $this->actingAs(admin())->postJson("/api/bookings/{$booking->id}/{$action}")->assertOk();

        expect(draftOf($booking))->toBeNull()
            ->and($booking->payments()->confirmed()->count())->toBe(1);
    })->with(['cancel', 'pending']);

    it('ne compte pas les brouillons dans le rappel du solde', function () {
        $booking = Booking::factory()->between('2026-12-01', '2026-12-04')->withClient(['email' => 'due@example.com'])->create(['prix_total' => 342]);
        validateBooking($booking, 171);

        Carbon::setTestNow('2026-11-17');
        $this->artisan('reminders:send')->assertSuccessful();

        Mail::assertSent(PaymentReminder::class, fn ($mail) => $mail->hasTo('due@example.com') && $mail->balance === 171.0);
    });

    it('crée les brouillons manquants des réservations déjà validées', function () {
        $upcoming = Booking::factory()->between('2026-12-01', '2026-12-04')->validated()->withClient()->create(['prix_total' => 342]);
        Payment::factory()->for($upcoming)->create(['montant_paiement' => 171]);
        $past = Booking::factory()->between('2026-01-01', '2026-01-04')->validated()->withClient()->create(['prix_total' => 342]);

        $this->artisan('payments:sync-drafts')->assertSuccessful();
        $this->artisan('payments:sync-drafts')->assertSuccessful();

        expect($upcoming->payments()->draft()->count())->toBe(1)
            ->and(draftOf($upcoming)->montant_paiement)->toEqual('171.00')
            ->and(draftOf($past))->toBeNull();
    });
});

describe('taxe de séjour enregistrée', function () {
    it('enregistre la taxe des réservations directes uniquement', function () {
        $public = $this->postJson('/api/bookings', publicBooking('2026-12-01', '2026-12-04'))->json('bookingId');
        expect(Booking::find($public)->taxe_sejour)->toEqual('12.00');

        $airbnb = $this->actingAs(admin())->postJson('/api/bookings', [
            ...publicBooking('2026-12-10', '2026-12-14'), 'type' => 'AirBnb', 'total' => 500,
        ])->json('bookingId');
        expect(Booking::find($airbnb)->taxe_sejour)->toEqual('0.00');
    });

    it('recalcule la taxe quand l’admin modifie le séjour, sauf si elle est saisie', function () {
        $booking = Booking::factory()->between('2026-12-01', '2026-12-04')->create(['taxe_sejour' => 12]);

        $this->actingAs(admin())->putJson("/api/bookings/{$booking->id}", [
            'checkIn' => '2026-12-01', 'checkOut' => '2026-12-06', 'adults' => 3, 'type' => 'Classique', 'total' => 600,
        ])->assertOk();
        expect($booking->fresh()->taxe_sejour)->toEqual('30.00'); // 5 nuits x 3 adultes x 2 €

        $this->actingAs(admin())->putJson("/api/bookings/{$booking->id}", [
            'checkIn' => '2026-12-01', 'checkOut' => '2026-12-06', 'adults' => 3, 'type' => 'Classique', 'total' => 600, 'touristTax' => 0,
        ])->assertOk();
        expect($booking->fresh()->taxe_sejour)->toEqual('0.00');
    });

    it('ignore une taxe envoyée par le site public', function () {
        $id = $this->postJson('/api/bookings', [...publicBooking('2026-12-01', '2026-12-04'), 'touristTax' => 0])->json('bookingId');

        expect(Booking::find($id)->taxe_sejour)->toEqual('12.00');
    });

    it('rattache une réservation admin à un client existant', function () {
        $existing = Booking::factory()->withClient(['nom' => 'Fidèle'])->create()->primaryClient();

        $id = $this->actingAs(admin())->postJson('/api/bookings', [
            'checkIn' => '2026-12-10', 'checkOut' => '2026-12-14', 'adults' => 2, 'type' => 'Classique', 'clientId' => $existing->id,
        ])->assertCreated()->json('bookingId');

        expect(Booking::find($id)->primaryClient()->id)->toBe($existing->id)
            ->and(Client::count())->toBe(1);
    });
});

it('refuse de supprimer une réservation qui a des paiements encaissés', function () {
    $booking = Booking::factory()->withClient()->create();
    Payment::factory()->for($booking)->create();

    $this->actingAs(admin())->deleteJson("/api/bookings/{$booking->id}")
        ->assertUnprocessable()
        ->assertJsonPath('message', __('booking.has_payments'));

    expect(Booking::find($booking->id))->not->toBeNull()
        ->and($booking->fresh()->statut)->toBe(BookingStatus::Pending);
});
