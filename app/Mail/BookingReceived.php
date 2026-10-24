<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Envoyé au client à la création de sa réservation, avec le RIB et le contrat.
 */
class BookingReceived extends Mailable
{
    public function __construct(public Booking $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('mail.received.subject'));
    }

    public function content(): Content
    {
        $percent = config('tidolasab.deposit_percent');

        return new Content(view: 'emails.booking-received', with: [
            'depositPercent' => $percent,
            'depositAmount' => round($this->booking->prix_total * $percent / 100, 2),
            'balanceDueDays' => config('tidolasab.balance_due_days'),
        ]);
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath(config('tidolasab.documents.rib'))->as('rib.pdf'),
            Attachment::fromPath(config('tidolasab.documents.contract'))->as('contrat_location.pdf'),
        ];
    }
}
