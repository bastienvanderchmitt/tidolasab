<?php

namespace App\Mail;

use App\Models\Booking;
use App\Models\Client;
use Carbon\CarbonInterface;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class BookingValidated extends Mailable
{
    public function __construct(
        public Booking $booking,
        public Client $client,
        public float $deposit,
        public float $balance,
        public ?CarbonInterface $balanceDueDate,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('mail.validated.subject'));
    }

    public function content(): Content
    {
        return new Content(view: 'emails.booking-validated');
    }
}
