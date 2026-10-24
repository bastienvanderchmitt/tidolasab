<?php

namespace App\Services;

use JsonSerializable;

/**
 * Détail du prix d'un séjour.
 */
final readonly class Quote implements JsonSerializable
{
    public function __construct(
        public int $nights,
        public int $highSeasonNights,
        public int $lowSeasonNights,
        public float $highSeasonPrice,
        public float $lowSeasonPrice,
        public float $touristTax,
        public float $discount,
        public float $total,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            'nights' => $this->nights,
            'high_season_nights' => $this->highSeasonNights,
            'low_season_nights' => $this->lowSeasonNights,
            'high_season_price' => $this->highSeasonPrice,
            'low_season_price' => $this->lowSeasonPrice,
            'tourist_tax' => $this->touristTax,
            'discount' => $this->discount,
            'total' => $this->total,
        ];
    }
}
