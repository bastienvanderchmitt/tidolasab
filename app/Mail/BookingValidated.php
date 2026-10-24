<?php

namespace App\Mail;

use App\Models\Booking;
use App\Models\Client;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class BookingValidated extends Mailable
{
    public function __construct(
        public Booking $booking,
        public Client $client,
        public float $deposit,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('mail.validated.subject'));
    }

    public function content(): Content
    {
        return new Content(view: 'emails.booking-validated', with: [
            'balance' => round($this->booking->prix_total - $this->deposit, 2),
            'balanceDueDate' => $this->booking->date_arrivee
                ->subDays(config('tidolasab.balance_due_days'))
                ->format('d/m/Y'),
        ]);
    }
}
