<?php

namespace App\Console\Commands;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('payments:sync-drafts')]
#[Description('Crée ou met à jour le paiement brouillon du solde des réservations directes validées à venir')]
class SyncBalanceDrafts extends Command
{
    public function handle(BookingService $bookings): int
    {
        $count = 0;

        Booking::query()
            ->where('type', BookingType::Classique)
            ->where('statut', BookingStatus::Validated)
            ->whereDate('date_depart', '>=', today())
            ->each(function (Booking $booking) use ($bookings, &$count) {
                $bookings->syncBalanceDraft($booking);
                $count++;
            });

        $this->info("$count réservation(s) vérifiée(s).");

        return self::SUCCESS;
    }
}
