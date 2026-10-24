<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Models\Booking;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    public function definition(): array
    {
        $arrival = fake()->dateTimeBetween('+1 month', '+6 months');

        return [
            'date_arrivee' => $arrival->format('Y-m-d'),
            'date_depart' => (clone $arrival)->modify('+3 days')->format('Y-m-d'),
            'nombre_nuits' => 3,
            'adultes' => 2,
            'enfants' => 0,
            'prix_total' => 342,
            'statut' => BookingStatus::Pending,
            'type' => BookingType::Classique,
        ];
    }

    public function between(string $checkIn, string $checkOut): static
    {
        return $this->state(fn () => [
            'date_arrivee' => $checkIn,
            'date_depart' => $checkOut,
            'nombre_nuits' => (int) round((strtotime($checkOut) - strtotime($checkIn)) / 86400),
        ]);
    }

    public function validated(): static
    {
        return $this->state(fn () => ['statut' => BookingStatus::Validated]);
    }

    public function withClient(array $attributes = []): static
    {
        return $this->afterCreating(fn (Booking $booking) => $booking->clients()->attach(Client::factory()->create($attributes)));
    }
}
