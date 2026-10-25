<?php

namespace App\Mail;

use App\Mail\Concerns\TracksEmail;
use App\Models\Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class BookingPending extends Mailable implements ShouldQueue
{
    use TracksEmail;

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
