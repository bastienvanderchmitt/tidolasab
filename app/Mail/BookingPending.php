<?php

namespace App\Mail;

use App\Models\Client;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class BookingPending extends Mailable
{
    public function __construct(public Client $client) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('mail.pending.subject'));
    }

    public function content(): Content
    {
        return new Content(view: 'emails.booking-pending');
    }
}
