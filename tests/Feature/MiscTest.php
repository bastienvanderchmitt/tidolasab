<?php

use App\Mail\ContactMessage;
use App\Mail\PaymentReminder;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

beforeEach(fn () => Mail::fake());

it('envoie le message de contact après vérification du reCAPTCHA', function () {
    Http::fake(['*recaptcha*' => Http::response(['success' => true])]);

    $this->postJson('/api/contact', [
        'name' => 'Marie', 'email' => 'marie@example.com', 'subject' => 'Disponibilités',
        'message' => 'Bonjour', 'recaptchaToken' => 'token',
    ])->assertOk();

    Mail::assertSent(ContactMessage::class, fn ($mail) => $mail->hasTo(config('tidolasab.admin_email'))
        && $mail->hasReplyTo('marie@example.com'));
});

it('renvoie une erreur si le reCAPTCHA échoue', function () {
    Http::fake(['*recaptcha*' => Http::response(['success' => false])]);

    $this->postJson('/api/contact', [
        'name' => 'Marie', 'email' => 'marie@example.com', 'subject' => 'Spam',
        'message' => 'Bonjour', 'recaptchaToken' => 'token',
    ])->assertUnprocessable()->assertJsonValidationErrors('recaptchaToken');

    Mail::assertNothingSent();
});

it('expose les règles tarifaires au front', function () {
    $this->getJson('/api/pricing')
        ->assertOk()
        ->assertJsonPath('pricing.tourist_tax', 2)
        ->assertJsonPath('pricing.low_season_months', [9, 10]);
});

it('rappelle le solde aux clients qui arrivent dans 14 jours', function () {
    Carbon::setTestNow('2026-11-17');

    $due = Booking::factory()->between('2026-12-01', '2026-12-04')->validated()->withClient(['email' => 'due@example.com'])->create(['prix_total' => 342]);
    Payment::factory()->for($due)->create(['montant_paiement' => 171]);

    $paid = Booking::factory()->between('2026-12-01', '2026-12-04')->validated()->withClient(['email' => 'paid@example.com'])->create(['prix_total' => 342]);
    Payment::factory()->for($paid)->create(['montant_paiement' => 342]);

    Booking::factory()->between('2026-12-01', '2026-12-04')->withClient(['email' => 'pending@example.com'])->create();

    $this->artisan('reminders:send')->assertSuccessful();

    Mail::assertSent(PaymentReminder::class, 1);
    Mail::assertSent(PaymentReminder::class, fn ($mail) => $mail->hasTo('due@example.com') && $mail->balance === 171.0);
});
