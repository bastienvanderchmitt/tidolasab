<?php

use App\Mail\BookingReceived;
use App\Mail\BookingVerificationCode;
use App\Models\Booking;
use App\Models\Client;
use App\Models\SentEmail;
use App\Services\EmailVerification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    Carbon::setTestNow('2026-10-24 10:00:00');
});

function verifiedPayload(array $overrides = []): array
{
    return array_merge([
        'checkIn' => '2026-12-01', 'checkOut' => '2026-12-04', 'adults' => 2,
        'name' => 'Dupont', 'firstName' => 'Marie', 'email' => 'marie@example.com', 'phone' => '0690112233',
        'address' => '1 rue des Palmiers', 'postalCode' => '97140', 'city' => 'Capesterre', 'country' => 'France',
        'language' => 'fr',
    ], $overrides);
}

describe('envoi du code', function () {
    it('envoie le code immédiatement, dans la langue du client', function () {
        $this->postJson('/api/bookings/verification-code', ['email' => 'marie@example.com', 'language' => 'en'])
            ->assertOk()
            ->assertJsonPath('resendIn', EmailVerification::RESEND_SECONDS);

        Mail::assertSent(BookingVerificationCode::class, fn ($mail) => $mail->hasTo('marie@example.com')
            && $mail->locale === 'en'
            && preg_match('/^\d{6}$/', $mail->code));
        Mail::assertNothingQueued();
        expect(SentEmail::where('type', 'BookingVerificationCode')->count())->toBe(1);
    });

    it('fait patienter avant de renvoyer un code', function () {
        $this->postJson('/api/bookings/verification-code', ['email' => 'marie@example.com'])->assertOk();
        $this->postJson('/api/bookings/verification-code', ['email' => 'MARIE@example.com'])->assertUnprocessable();

        Carbon::setTestNow(now()->addSeconds(EmailVerification::RESEND_SECONDS));
        $this->postJson('/api/bookings/verification-code', ['email' => 'marie@example.com'])->assertOk();

        Mail::assertSent(BookingVerificationCode::class, 2);
    });

    it('refuse une adresse mal formée', function () {
        $this->postJson('/api/bookings/verification-code', ['email' => 'marie@gmail'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    });
});

describe('réservation publique', function () {
    it('n’envoie le contrat qu’avec le bon code', function () {
        $this->postJson('/api/bookings', verifiedPayload())
            ->assertUnprocessable()->assertJsonValidationErrors('verificationCode');

        $code = verificationCode('marie@example.com');
        $wrong = $code === '000000' ? '111111' : '000000';

        $this->postJson('/api/bookings', verifiedPayload(['verificationCode' => $wrong]))
            ->assertUnprocessable()->assertJsonValidationErrors('verificationCode');
        Mail::assertNotQueued(BookingReceived::class);

        // L'email saisi avec une autre casse correspond au même code
        $this->postJson('/api/bookings', verifiedPayload(['email' => ' Marie@Example.com', 'verificationCode' => $code]))
            ->assertCreated();
        Mail::assertQueued(BookingReceived::class);

        // Un code ne sert qu'une fois
        $this->postJson('/api/bookings', verifiedPayload([
            'checkIn' => '2026-12-10', 'checkOut' => '2026-12-13', 'verificationCode' => $code,
        ]))->assertUnprocessable()->assertJsonValidationErrors('verificationCode');
    });

    it('bloque le code après trop d’essais', function () {
        $code = verificationCode('marie@example.com');
        $wrong = $code === '000000' ? '111111' : '000000';

        foreach (range(1, EmailVerification::MAX_ATTEMPTS) as $attempt) {
            app(EmailVerification::class)->check('marie@example.com', $wrong);
        }

        $this->postJson('/api/bookings', verifiedPayload(['verificationCode' => $code]))
            ->assertUnprocessable()->assertJsonValidationErrors('verificationCode');
    });

    it('garde le code si la réservation échoue, pour réessayer', function () {
        $code = verificationCode('marie@example.com');

        // Trop court : refusé après la vérification du code
        $this->postJson('/api/bookings', verifiedPayload(['checkOut' => '2026-12-02', 'verificationCode' => $code]))
            ->assertUnprocessable();
        $this->postJson('/api/bookings', verifiedPayload(['verificationCode' => $code]))->assertCreated();
    });

    it('n’exige pas de code pour une réservation saisie dans l’admin', function () {
        $this->actingAs(admin())->postJson('/api/bookings', verifiedPayload(['type' => 'Classique', 'total' => 300]))
            ->assertCreated();
    });
});

describe('client existant', function () {
    it('rattache la réservation à la fiche ayant le même email', function () {
        $client = Client::factory()->create([
            'nom' => 'Dupont', 'prenom' => 'Marie', 'email' => 'Marie@Example.com',
            'telephone' => '0590000000', 'note' => 'Fidèle',
        ]);

        $id = $this->postJson('/api/bookings', verifiedPayload([
            'name' => 'Dupond', 'phone' => '0690 99 88 77',
            'verificationCode' => verificationCode('marie@example.com'),
        ]))->assertCreated()->json('bookingId');

        expect(Client::count())->toBe(1)
            ->and(Booking::find($id)->clients->first()->id)->toBe($client->id)
            ->and($client->fresh())
            ->telephone->toBe('0690 99 88 77')
            ->adresse->toBe('1 rue des Palmiers, 97140 Capesterre, France')
            ->nom->toBe('Dupont')
            ->note->toBe('Fidèle');
    });

    it('crée une nouvelle fiche pour un nouvel email, en minuscules', function () {
        Client::factory()->create(['email' => 'autre@example.com']);

        $this->postJson('/api/bookings', verifiedPayload([
            'email' => 'Nouvelle@Example.com', 'verificationCode' => verificationCode('nouvelle@example.com'),
        ]))->assertCreated();

        expect(Client::count())->toBe(2)
            ->and(Client::latest('id')->first()->email)->toBe('nouvelle@example.com');
    });

    it('dans l’admin, complète seulement la fiche existante', function () {
        $client = Client::factory()->create(['email' => 'marie@example.com', 'telephone' => '', 'adresse' => 'Ancienne adresse']);

        $this->actingAs(admin())->postJson('/api/bookings', verifiedPayload(['type' => 'Classique', 'total' => 300]))
            ->assertCreated();

        expect(Client::count())->toBe(1)
            ->and($client->fresh())
            ->telephone->toBe('0690112233')
            ->adresse->toBe('Ancienne adresse');
    });
});
