<?php

namespace App\Listeners;

use App\Enums\EmailStatus;
use App\Models\SentEmail;
use Illuminate\Mail\Events\MessageSending;
use Illuminate\Mail\Events\MessageSent;
use Symfony\Component\Mime\Email;

/**
 * Met à jour le suivi des emails au moment de l'envoi : sujet et contenu
 * enregistrés, pixel d'ouverture ajouté, puis statut « envoyé ».
 */
class TrackSentEmails
{
    public function handleSending(MessageSending $event): void
    {
        $email = $this->trackedEmail($event->message);
        if (! $email) {
            return;
        }

        $html = $event->message->getHtmlBody();

        // Le contenu est enregistré sans le pixel : l'afficher dans l'admin ne compte pas d'ouverture
        $email->update([
            'sujet' => $event->message->getSubject(),
            'html' => is_string($html) ? $html : null,
        ]);

        if (is_string($html)) {
            $event->message->html($this->withPixel($html, $email));
        }
    }

    public function handleSent(MessageSent $event): void
    {
        $this->trackedEmail($event->message)?->update([
            'statut' => EmailStatus::Sent,
            'envoye_le' => now(),
            'erreur' => null,
        ]);
    }

    private function trackedEmail(Email $message): ?SentEmail
    {
        $id = $message->getHeaders()->get(SentEmail::TRACKING_HEADER)?->getBodyAsString();

        return $id ? SentEmail::find($id) : null;
    }

    private function withPixel(string $html, SentEmail $email): string
    {
        $pixel = sprintf(
            '<img src="%s" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;">',
            e(route('emails.pixel', $email->token)),
        );

        return str_contains($html, '</body>')
            ? preg_replace('~</body>~', $pixel.'</body>', $html, 1)
            : $html.$pixel;
    }
}
