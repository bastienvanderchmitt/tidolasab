<?php

namespace App\Services;

use App\Enums\EmailStatus;
use App\Exceptions\BusinessException;
use App\Mail\BookingVerificationCode;
use Illuminate\Support\Facades\Cache;

/**
 * Code à 6 chiffres envoyé avant une réservation publique : il prouve que le client
 * reçoit bien les emails à l'adresse saisie, avant de lui envoyer le contrat.
 * Le code est conservé haché en cache, pour une durée et un nombre d'essais limités.
 */
class EmailVerification
{
    public const TTL_MINUTES = 15;

    public const MAX_ATTEMPTS = 5;

    public const RESEND_SECONDS = 60;

    public function __construct(private readonly EmailService $emails) {}

    public function send(string $email, string $locale): void
    {
        $email = self::normalize($email);
        $current = Cache::get($this->key($email));

        $wait = $current ? self::RESEND_SECONDS - (now()->timestamp - $current['sent_at']) : 0;
        if ($wait > 0) {
            throw new BusinessException(__('booking.code_wait', ['seconds' => $wait]));
        }

        $code = $this->issue($email);

        // Envoi immédiat : le client attend le code sur la page
        $sent = $this->emails->send($email, (new BookingVerificationCode($code))->locale($locale), immediately: true);

        if (! $sent || $sent->statut === EmailStatus::Failed) {
            Cache::forget($this->key($email));

            throw new BusinessException(__('booking.code_not_sent'));
        }
    }

    /**
     * Génère et mémorise un nouveau code (sans l'envoyer).
     */
    public function issue(string $email): string
    {
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put($this->key(self::normalize($email)), [
            'hash' => $this->hash($code),
            'attempts' => 0,
            'sent_at' => now()->timestamp,
        ], now()->addMinutes(self::TTL_MINUTES));

        return $code;
    }

    /**
     * Le code reste valable après un succès : la réservation peut encore échouer
     * (dates prises entre-temps) et le client doit pouvoir réessayer. Il est oublié
     * une fois la réservation enregistrée.
     */
    public function check(string $email, ?string $code): bool
    {
        $key = $this->key(self::normalize($email));
        $entry = Cache::get($key);

        if (! $entry || $entry['attempts'] >= self::MAX_ATTEMPTS) {
            return false;
        }

        if ($code !== null && hash_equals($entry['hash'], $this->hash($code))) {
            return true;
        }

        $entry['attempts']++;
        Cache::put($key, $entry, now()->addMinutes(self::TTL_MINUTES));

        return false;
    }

    public function forget(string $email): void
    {
        Cache::forget($this->key(self::normalize($email)));
    }

    public static function normalize(string $email): string
    {
        return mb_strtolower(trim($email));
    }

    private function key(string $email): string
    {
        return 'booking-verification:'.hash('sha256', $email);
    }

    private function hash(string $code): string
    {
        return hash_hmac('sha256', $code, (string) config('app.key'));
    }
}
