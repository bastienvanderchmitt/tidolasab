<?php

namespace App\Mail;

use App\Mail\Concerns\TracksEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Renvoi, depuis l'admin, d'un email déjà généré : même sujet, même contenu.
 */
class StoredEmail extends Mailable implements ShouldQueue
{
    use TracksEmail;

    public function __construct(
        public string $storedSubject,
        public string $storedHtml,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->storedSubject);
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->storedHtml);
    }
}
