<?php

namespace App\Console\Commands;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Mail\PaymentReminder;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

#[Signature('reminders:send')]
#[Description('Rappelle le solde à payer aux clients dont le séjour commence dans 14 jours')]
class SendPaymentReminders extends Command
{
    public function handle(BookingService $bookings): int
    {
        $days = config('tidolasab.balance_due_days');

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

            // Un échec d'envoi est remonté à Sentry sans bloquer les autres rappels
            rescue(function () use ($client, $balance, $days, &$sent) {
                Mail::to($client->email)->locale($client->mailLocale())->send(new PaymentReminder($balance, $days));
                $sent++;
            });
        }

        $this->info("$sent rappel(s) envoyé(s).");

        return self::SUCCESS;
    }
}
