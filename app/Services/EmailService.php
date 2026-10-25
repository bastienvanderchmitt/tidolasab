<?php

namespace App\Services;

use App\Enums\EmailStatus;
use App\Models\Booking;
use App\Models\Client;
use App\Models\SentEmail;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Point d'envoi unique des emails, mis en file d'attente (traitée chaque minute par le cron).
 * Les emails aux clients sont enregistrés pour le suivi dans l'admin ; ceux adressés
 * à l'administration (nouvelle réservation, message de contact) ne le sont pas.
 */
class EmailService
{
    /**
     * Un email qui échoue ne doit pas annuler l'action : l'erreur est enregistrée
     * dans le suivi et remontée à Sentry.
     * Avec $immediately, l'email part tout de suite au lieu de passer par la file.
     */
    public function send(string $to, Mailable $mail, ?Booking $booking = null, ?Client $client = null, ?string $type = null, bool $immediately = false): ?SentEmail
    {
        if ($to === config('tidolasab.admin_email')) {
            rescue(fn () => Mail::to($to)->queue($mail));

            return null;
        }

        return rescue(function () use ($to, $mail, $booking, $client, $type, $immediately) {
            $email = SentEmail::create([
                'type' => $type ?? class_basename($mail),
                'destinataire' => $to,
                'langue' => $mail->locale ?? app()->getLocale(),
                'id_reservation' => $booking?->id,
                'id_client' => $client?->id,
            ]);

            try {
                $pending = Mail::to($to);
                $immediately ? $pending->sendNow($mail->trackAs($email)) : $pending->queue($mail->trackAs($email));
            } catch (Throwable $exception) {
                $email->update(['statut' => EmailStatus::Failed, 'erreur' => mb_substr($exception->getMessage(), 0, 2000)]);
                report($exception);
            }

            return $email;
        });
    }
}
