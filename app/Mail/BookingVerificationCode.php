<?php

namespace App\Mail;

use App\Mail\Concerns\TracksEmail;
use App\Services\EmailVerification;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Envoyé immédiatement (hors file d'attente) : le client attend le code sur le site.
 */
class BookingVerificationCode extends Mailable
{
    use TracksEmail;

    public function __construct(public string $code) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('mail.verification.subject', ['code' => $this->code]));
    }

    public function content(): Content
    {
        return new Content(view: 'emails.booking-verification-code', with: [
            'minutes' => EmailVerification::TTL_MINUTES,
        ]);
    }
}
