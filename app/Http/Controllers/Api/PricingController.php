<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BookingSettings;
use App\Services\PricingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Règles tarifaires exposées au front, pour un affichage identique au calcul serveur.
 */
class PricingController extends Controller
{
    public function show(BookingSettings $settings): JsonResponse
    {
        return response()->json(['pricing' => $settings->all()]);
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
