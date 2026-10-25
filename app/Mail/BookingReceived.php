<?php

namespace App\Mail;

use App\Mail\Concerns\TracksEmail;
use App\Models\Booking;
use App\Services\BookingSettings;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Envoyé au client à la création de sa réservation, avec le RIB et le contrat.
 * Si l'arrivée est proche, la totalité du séjour est demandée au lieu de l'acompte.
 */
class BookingReceived extends Mailable implements ShouldQueue
{
    use TracksEmail;

    public function __construct(
        public Booking $booking,
        public float $amountDue,
        public bool $fullPayment,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('mail.received.subject'));
    }

    public function content(): Content
    {
        $settings = app(BookingSettings::class);

        return new Content(view: 'emails.booking-received', with: [
            'depositPercent' => $settings->get('deposit_percent'),
            'balanceDueDays' => $settings->get('balance_due_days'),
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
