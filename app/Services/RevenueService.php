<?php

namespace App\Services;

use App\Enums\BookingType;
use App\Models\Payment;

/**
 * Chiffre d'affaires par année et par mois, calculé à partir des paiements.
 *
 * - basis « payment » : un paiement compte dans le mois où il est encaissé (ou attendu, pour un brouillon)
 * - basis « stay »    : un paiement compte dans le mois d'arrivée du séjour
 *
 * La part de taxe de séjour d'un paiement est proportionnelle à la taxe comprise
 * dans le prix de sa réservation : le front peut ainsi afficher le CA avec ou sans taxe,
 * avec ou sans brouillons.
 */
class RevenueService
{
    public const BASES = ['payment', 'stay'];

    public function byYear(string $basis): array
    {
        $years = [];

        Payment::query()
            ->with('booking:id,date_arrivee,type,prix_total,taxe_sejour')
            ->get()
            ->each(function (Payment $payment) use ($basis, &$years) {
                $booking = $payment->booking;
                if (! $booking) {
                    return;
                }

                $date = $basis === 'stay' ? $booking->date_arrivee : $payment->date_paiement;
                $year = $date->year;
                $month = $date->month;
                $bucket = $payment->isDraft() ? 'draft' : 'confirmed';
                $amount = (float) $payment->montant_paiement;
                $tax = $booking->prix_total > 0 ? $amount * $booking->taxe_sejour / $booking->prix_total : 0;

                $years[$year] ??= $this->emptyYear($year);
                $years[$year][$bucket] += $amount;
                $years[$year]["tax_$bucket"] += $tax;
                $years[$year]['months'][$month - 1][$bucket] += $amount;
                $years[$year]['months'][$month - 1]["tax_$bucket"] += $tax;
                $years[$year]['by_type'][$booking->type->value][$bucket] += $amount;
                $years[$year]['by_type'][$booking->type->value]["tax_$bucket"] += $tax;
            });

        krsort($years);

        return array_values(array_map(fn (array $year) => $this->rounded($year), $years));
    }

    private function emptyYear(int $year): array
    {
        $amounts = ['confirmed' => 0.0, 'draft' => 0.0, 'tax_confirmed' => 0.0, 'tax_draft' => 0.0];

        return [
            'year' => $year,
            ...$amounts,
            'months' => array_map(fn (int $month) => ['month' => $month, ...$amounts], range(1, 12)),
            'by_type' => collect(BookingType::cases())
                ->mapWithKeys(fn (BookingType $type) => [$type->value => $amounts])
                ->all(),
        ];
    }

    private function rounded(array $values): array
    {
        return array_map(
            fn ($value) => match (true) {
                is_array($value) => $this->rounded($value),
                is_float($value) => round($value, 2),
                default => $value,
            },
            $values,
        );
    }
}
