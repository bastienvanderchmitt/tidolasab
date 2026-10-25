<?php

namespace App\Mail\Concerns;

use App\Enums\EmailStatus;
use App\Models\SentEmail;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;
use Throwable;

/**
 * Email envoyé en file d'attente et suivi dans l'admin (table « emails ») :
 * l'en-tête SentEmail::TRACKING_HEADER relie le message envoyé à sa ligne de suivi.
 */
trait TracksEmail
{
    use SerializesModels;

    public ?int $emailId = null;

    /**
     * Trois tentatives : une erreur passagère du serveur SMTP ne perd pas l'email.
     */
    public int $tries = 3;

    public function trackAs(SentEmail $email): static
    {
        $this->emailId = $email->id;

        return $this;
    }

    public function headers(): Headers
    {
        return new Headers(text: $this->emailId ? [SentEmail::TRACKING_HEADER => (string) $this->emailId] : []);
    }

    /**
     * Une minute, puis cinq, avant de réessayer.
     */
    public function backoff(): array
    {
        return [60, 300];
    }

    /**
     * Appelé après la dernière tentative.
     */
    public function failed(Throwable $exception): void
    {
        SentEmail::whereKey($this->emailId)->update([
            'statut' => EmailStatus::Failed,
            'erreur' => mb_substr($exception->getMessage(), 0, 2000),
        ]);
    }
}
