<?php

namespace App\Services;

use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;

class PricingService
{
    public function __construct(private readonly BookingSettings $settings) {}

    /**
     * Prix d'un séjour du soir de $checkIn au matin de $checkOut.
     */
    public function quote(string $checkIn, string $checkOut, int $adults): Quote
    {
        $arrival = CarbonImmutable::parse($checkIn)->startOfDay();
        $departure = CarbonImmutable::parse($checkOut)->startOfDay();

        [$lowPrice, $highPrice] = $this->ratesFor($arrival->year);
        $lowMonths = array_map('intval', $this->settings->get('low_season_months'));

        $nights = $lowNights = 0;
        foreach (CarbonPeriod::create($arrival, $departure->subDay()) as $night) {
            $nights++;
            if (in_array($night->month, $lowMonths, true)) {
                $lowNights++;
            }
        }
        $highNights = $nights - $lowNights;

        $accommodation = $highNights * $highPrice + $lowNights * $lowPrice;
        $touristTax = $nights * $adults * (float) $this->settings->get('tourist_tax');

        // Une demi-nuit (au prix moyen du séjour) offerte par tranche de N nuits, 0 = pas de remise
        $threshold = (int) $this->settings->get('discount_nights_threshold');
        $discount = $nights > 0 && $threshold > 0
            ? round(intdiv($nights, $threshold) * ($accommodation / $nights / 2))
            : 0.0;

        return new Quote(
            nights: $nights,
            highSeasonNights: $highNights,
            lowSeasonNights: $lowNights,
            highSeasonPrice: $highPrice,
            lowSeasonPrice: $lowPrice,
            touristTax: $touristTax,
            discount: $discount,
            total: $accommodation + $touristTax - $discount,
        );
    }

    /**
     * @return array{0: float, 1: float} [prix basse saison, prix haute saison]
     */
    public function ratesFor(int $year): array
    {
        $rate = collect($this->settings->get('rates'))
            ->sortBy('from_year')
            ->last(fn (array $rate) => $rate['from_year'] <= $year);

        return [(float) $rate['low'], (float) $rate['high']];
    }
}
