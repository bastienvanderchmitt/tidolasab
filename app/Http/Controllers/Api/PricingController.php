<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PricingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Règles tarifaires exposées au front, pour un affichage identique au calcul serveur.
 */
class PricingController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['pricing' => [
            'rates' => config('tidolasab.rates'),
            'low_season_months' => config('tidolasab.low_season_months'),
            'tourist_tax' => config('tidolasab.tourist_tax'),
            'discount_nights_threshold' => config('tidolasab.discount_nights_threshold'),
            'minimum_nights' => config('tidolasab.minimum_nights'),
            'minimum_stay_periods' => config('tidolasab.minimum_stay_periods'),
            'deposit_percent' => config('tidolasab.deposit_percent'),
        ]]);
    }

    public function quote(Request $request, PricingService $pricing): JsonResponse
    {
        $data = $request->validate([
            'checkIn' => ['required', 'date_format:Y-m-d'],
            'checkOut' => ['required', 'date_format:Y-m-d', 'after:checkIn'],
            'adults' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        return response()->json(['quote' => $pricing->quote($data['checkIn'], $data['checkOut'], (int) $data['adults'])]);
    }
}
