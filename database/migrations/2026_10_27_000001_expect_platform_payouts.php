<?php

use Carbon\CarbonImmutable;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const PLATFORMS = ['AirBnb' => 'Airbnb', 'Booking' => 'Booking'];

    /**
     * Le versement à venir d'une plateforme était noté comme un paiement encaissé
     * de 0 €, à sa date prévue. Il devient un paiement attendu (brouillon) du
     * montant restant, comme le solde d'une réservation directe.
     */
    public function up(): void
    {
        $stored = DB::table('settings')->where('key', 'payout_days')->value('value');
        $delays = $stored ? json_decode($stored, true) : config('tidolasab.payout_days');

        DB::transaction(function () use ($delays) {
            $bookings = DB::table('reservations')
                ->whereIn('type', array_keys(self::PLATFORMS))
                ->get(['id', 'type', 'statut', 'date_depart', 'prix_total']);

            foreach ($bookings as $booking) {
                $placeholders = DB::table('paiements')
                    ->where('id_reservation', $booking->id)
                    ->where('statut', 'confirmé')
                    ->where('montant_paiement', 0);
                $plannedDate = (clone $placeholders)->min('date_paiement');
                $placeholders->delete();

                $payments = DB::table('paiements')->where('id_reservation', $booking->id);
                $alreadyPaid = (clone $payments)->where('statut', 'confirmé')->where('montant_paiement', '>', 0)->exists();
                $hasDraft = (clone $payments)->where('statut', 'brouillon')->exists();

                if ($booking->statut !== 'validée' || $alreadyPaid || $hasDraft) {
                    continue;
                }

                $remaining = round($booking->prix_total - (clone $payments)->where('statut', 'confirmé')->sum('montant_paiement'), 2);
                if ($remaining <= 0) {
                    continue;
                }

                DB::table('paiements')->insert([
                    'id_reservation' => $booking->id,
                    'montant_paiement' => $remaining,
                    'date_paiement' => $plannedDate
                        ?? CarbonImmutable::parse($booking->date_depart)->addDays((int) ($delays[$booking->type] ?? 0))->toDateString(),
                    'moyen_paiement' => 'virement',
                    'statut' => 'brouillon',
                    'note' => __('booking.payout_draft_note', ['platform' => self::PLATFORMS[$booking->type]]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });
    }

    /**
     * Revient aux paiements encaissés de 0 € à la date prévue.
     */
    public function down(): void
    {
        DB::table('paiements')
            ->where('statut', 'brouillon')
            ->whereIn('id_reservation', DB::table('reservations')->whereIn('type', array_keys(self::PLATFORMS))->select('id'))
            ->update(['statut' => 'confirmé', 'montant_paiement' => 0, 'note' => null]);
    }
};
