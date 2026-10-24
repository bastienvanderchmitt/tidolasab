<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\DB;

/**
 * Règles de réservation modifiables depuis l'admin.
 * Une valeur absente de la table « settings » reprend celle de config/tidolasab.php.
 */
class BookingSettings
{
    public const KEYS = [
        'rates',
        'low_season_months',
        'tourist_tax',
        'discount_nights_threshold',
        'minimum_nights',
        'minimum_stay_periods',
        'deposit_percent',
        'balance_due_days',
    ];

    private ?array $stored = null;

    public function get(string $key): mixed
    {
        $this->stored ??= Setting::query()->whereIn('key', self::KEYS)->pluck('value', 'key')->all();

        return array_key_exists($key, $this->stored) ? $this->stored[$key] : config("tidolasab.$key");
    }

    public function all(): array
    {
        return collect(self::KEYS)->mapWithKeys(fn (string $key) => [$key => $this->get($key)])->all();
    }

    public function update(array $values): void
    {
        DB::transaction(function () use ($values) {
            foreach (array_intersect_key($values, array_flip(self::KEYS)) as $key => $value) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        });

        $this->stored = null;
    }
}
