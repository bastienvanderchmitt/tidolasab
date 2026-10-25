<?php

namespace App\Mail;

use App\Mail\Concerns\TracksEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ContactMessage extends Mailable implements ShouldQueue
{
    use TracksEmail;

    public function __construct(
        public string $name,
        public string $email,
        public string $contactSubject,
        public string $body,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->email, $this->name)],
            subject: $this->contactSubject,
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact-message');
    }
}
