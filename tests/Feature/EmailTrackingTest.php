<?php

use App\Enums\EmailStatus;
use App\Mail\AdminNewBooking;
use App\Mail\BookingCancelled;
use App\Mail\StoredEmail;
use App\Models\Booking;
use App\Models\SentEmail;
use App\Services\EmailService;
use Illuminate\Support\Facades\Mail;

it('enregistre chaque email envoyé avec sa réservation et son client', function () {
    Mail::fake();
    $booking = Booking::factory()->withClient(['email' => 'client@example.com'])->create();

    $this->actingAs(admin())->postJson("/api/bookings/{$booking->id}/cancel")->assertOk();

    Mail::assertQueued(BookingCancelled::class, fn ($mail) => $mail->emailId !== null);
    expect(SentEmail::sole())
        ->type->toBe('BookingCancelled')
        ->destinataire->toBe('client@example.com')
        ->id_reservation->toBe($booking->id)
        ->id_client->toBe($booking->primaryClient()->id)
        ->statut->toBe(EmailStatus::Queued);
});

it('passe l’email en « envoyé » avec son sujet et son contenu, et ajoute le pixel d’ouverture', function () {
    config(['mail.default' => 'array']);
    $email = app(EmailService::class)->send('client@example.com', new BookingCancelled);

    $email->refresh();
    $sent = app('mailer')->getSymfonyTransport()->messages()->last()->getOriginalMessage();

    expect($email)
        ->statut->toBe(EmailStatus::Sent)
        ->sujet->toBe(__('mail.cancelled.subject'))
        ->envoye_le->not->toBeNull()
        ->and($email->html)->not->toContain('pixel.gif')
        ->and($sent->getHtmlBody())->toContain(route('emails.pixel', $email->token));
});

it('enregistre l’échec d’envoi sans bloquer l’action', function () {
    config(['mail.default' => 'failing', 'mail.mailers.failing' => ['transport' => 'smtp', 'host' => '127.0.0.1', 'port' => 1, 'timeout' => 1]]);

    $email = app(EmailService::class)->send('client@example.com', new BookingCancelled);

    expect($email->fresh())
        ->statut->toBe(EmailStatus::Failed)
        ->erreur->not->toBeEmpty();
});

it('compte les ouvertures grâce au pixel', function () {
    $email = SentEmail::create(['type' => 'BookingCancelled', 'destinataire' => 'client@example.com', 'statut' => 'envoyé']);

    $this->get("/api/emails/{$email->token}/pixel.gif")->assertOk()->assertHeader('Content-Type', 'image/gif');
    $this->get("/api/emails/{$email->token}/pixel.gif")->assertOk();
    $this->get('/api/emails/inconnu/pixel.gif')->assertOk();

    expect($email->fresh())->ouvertures->toBe(2)->ouvert_le->not->toBeNull();
});

it('liste les emails pour l’admin, sans exposer le contenu ni le jeton', function () {
    $booking = Booking::factory()->withClient(['nom' => 'Dupont', 'prenom' => 'Marie'])->create();
    SentEmail::create(['type' => 'BookingCancelled', 'destinataire' => 'a@example.com', 'id_reservation' => $booking->id, 'id_client' => $booking->primaryClient()->id, 'html' => '<p>Bonjour</p>']);
    SentEmail::create(['type' => 'ContactMessage', 'destinataire' => 'b@example.com']);

    $this->getJson('/api/emails')->assertUnauthorized();

    $this->actingAs(admin())->getJson("/api/emails?booking={$booking->id}")
        ->assertOk()
        ->assertJsonCount(1, 'emails')
        ->assertJsonPath('emails.0.nom_client', 'Dupont Marie')
        ->assertJsonMissingPath('emails.0.html')
        ->assertJsonMissingPath('emails.0.token');

    $id = SentEmail::where('type', 'BookingCancelled')->value('id');
    $this->actingAs(admin())->getJson("/api/emails/{$id}")->assertJsonPath('email.html', '<p>Bonjour</p>');
});

it('renvoie un email avec le même contenu', function () {
    Mail::fake();
    $original = SentEmail::create(['type' => 'BookingCancelled', 'destinataire' => 'a@example.com', 'sujet' => 'Annulation', 'langue' => 'en', 'html' => '<p>Hello</p>', 'statut' => 'échec']);

    $this->actingAs(admin())->postJson("/api/emails/{$original->id}/resend")->assertCreated();

    Mail::assertQueued(StoredEmail::class, fn ($mail) => $mail->hasTo('a@example.com') && $mail->storedSubject === 'Annulation' && $mail->locale === 'en');
    expect(SentEmail::latest('id')->first())->type->toBe('BookingCancelled')->id->not->toBe($original->id);

    $empty = SentEmail::create(['type' => 'BookingCancelled', 'destinataire' => 'a@example.com']);
    $this->actingAs(admin())->postJson("/api/emails/{$empty->id}/resend")
        ->assertUnprocessable()
        ->assertJsonPath('message', __('booking.email_not_resendable'));
});

it('ne suit pas les emails adressés à l’administration', function () {
    Mail::fake();
    Booking::factory()->withClient()->create();

    $this->postJson('/api/bookings', publicBooking('2026-12-01', '2026-12-04'))->assertCreated();

    Mail::assertQueued(AdminNewBooking::class);
    expect(SentEmail::pluck('type')->all())->toBe(['BookingReceived']);
});
