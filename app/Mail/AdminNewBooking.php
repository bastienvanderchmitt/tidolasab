<?php

namespace App\Mail;

use App\Mail\Concerns\TracksEmail;
use App\Models\Booking;
use App\Models\Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class AdminNewBooking extends Mailable implements ShouldQueue
{
    use TracksEmail;

    public function __construct(
        public Booking $booking,
        public ?Client $client,
        public bool $fullPayment = false,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Nouvelle réservation !');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.admin-new-booking');
    }
}
