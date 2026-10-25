<?php

namespace App\Mail;

use App\Mail\Concerns\TracksEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PaymentReminder extends Mailable implements ShouldQueue
{
    use TracksEmail;

    public function __construct(public float $balance, public int $days) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('mail.reminder.subject'));
    }

    public function content(): Content
    {
        return new Content(view: 'emails.payment-reminder');
    }
}
