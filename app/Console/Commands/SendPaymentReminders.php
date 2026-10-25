<?php

namespace App\Console\Commands;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Mail\PaymentReminder;
use App\Models\Booking;
use App\Services\BookingService;
use App\Services\BookingSettings;
use App\Services\EmailService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('reminders:send')]
#[Description('Rappelle le solde à payer aux clients dont le séjour commence dans X jours (réglage « balance_due_days »)')]
class SendPaymentReminders extends Command
{
    public function handle(BookingService $bookings, BookingSettings $settings, EmailService $emails): int
    {
        $days = (int) $settings->get('balance_due_days');

        $upcoming = Booking::query()
            ->with('clients')
            ->whereDate('date_arrivee', today()->addDays($days))
            ->where('statut', BookingStatus::Validated)
            ->where('type', '<>', BookingType::Fermeture)
            ->get();

        $sent = 0;
        foreach ($upcoming as $booking) {
            $client = $booking->primaryClient();
            $balance = $bookings->balance($booking);

            if (! $client?->email || $balance <= 0) {
                continue;
            }

            // Un échec d'envoi est enregistré dans le suivi sans bloquer les autres rappels
            $mail = (new PaymentReminder($balance, $days))->locale($client->mailLocale());
            if ($emails->send($client->email, $mail, $booking, $client)) {
                $sent++;
            }
        }

        $this->info("$sent rappel(s) mis en file d’envoi.");

        return self::SUCCESS;
    }
}
