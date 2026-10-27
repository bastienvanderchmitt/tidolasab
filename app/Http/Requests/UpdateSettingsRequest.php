<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'rates' => ['required', 'array', 'min:1'],
            'rates.*.from_year' => ['required', 'integer', 'min:0', 'max:2100', 'distinct'],
            'rates.*.low' => ['required', 'numeric', 'gt:0'],
            'rates.*.high' => ['required', 'numeric', 'gt:0'],
            'low_season_months' => ['present', 'array'],
            'low_season_months.*' => ['integer', 'between:1,12', 'distinct'],
            'tourist_tax' => ['required', 'numeric', 'min:0'],
            'discount_nights_threshold' => ['required', 'integer', 'min:0', 'max:365'],
            'minimum_nights' => ['required', 'integer', 'min:1', 'max:60'],
            'minimum_stay_periods' => ['present', 'array'],
            'minimum_stay_periods.*.start' => ['required', 'date_format:Y-m-d'],
            'minimum_stay_periods.*.end' => ['required', 'date_format:Y-m-d', 'after_or_equal:minimum_stay_periods.*.start'],
            'minimum_stay_periods.*.nights' => ['required', 'integer', 'min:1', 'max:60'],
            'deposit_percent' => ['required', 'integer', 'between:0,100'],
            'balance_due_days' => ['required', 'integer', 'between:0,90'],
            'payout_days' => ['required', 'array:AirBnb,Booking'],
            'payout_days.AirBnb' => ['required', 'integer', 'between:0,60'],
            'payout_days.Booking' => ['required', 'integer', 'between:0,60'],
        ];
    }

    /**
     * Valeurs typées et triées, prêtes à être enregistrées.
     */
    public function settings(): array
    {
        $data = $this->validated();

        return [
            'rates' => collect($data['rates'])
                ->map(fn (array $rate) => [
                    'from_year' => (int) $rate['from_year'],
                    'low' => (float) $rate['low'],
                    'high' => (float) $rate['high'],
                ])
                ->sortBy('from_year')
                ->values()
                ->all(),
            'low_season_months' => collect($data['low_season_months'])->map(fn ($m) => (int) $m)->sort()->values()->all(),
            'tourist_tax' => (float) $data['tourist_tax'],
            'discount_nights_threshold' => (int) $data['discount_nights_threshold'],
            'minimum_nights' => (int) $data['minimum_nights'],
            'minimum_stay_periods' => collect($data['minimum_stay_periods'])
                ->map(fn (array $period) => [
                    'start' => $period['start'],
                    'end' => $period['end'],
                    'nights' => (int) $period['nights'],
                ])
                ->sortBy('start')
                ->values()
                ->all(),
            'deposit_percent' => (int) $data['deposit_percent'],
            'balance_due_days' => (int) $data['balance_due_days'],
            'payout_days' => [
                'AirBnb' => (int) $data['payout_days']['AirBnb'],
                'Booking' => (int) $data['payout_days']['Booking'],
            ],
        ];
    }
}
