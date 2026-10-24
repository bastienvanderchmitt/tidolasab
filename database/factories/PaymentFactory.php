<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_reservation' => Booking::factory(),
            'montant_paiement' => 100,
            'date_paiement' => now()->toDateString(),
            'moyen_paiement' => 'virement',
        ];
    }
}
