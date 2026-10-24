<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSettingsRequest;
use App\Services\BookingSettings;
use Illuminate\Http\JsonResponse;

/**
 * Tarifs, saisons, taxe de séjour, durées minimales et acompte.
 * Les réservations existantes gardent le prix enregistré à leur création.
 */
class SettingsController extends Controller
{
    public function show(BookingSettings $settings): JsonResponse
    {
        return response()->json(['settings' => $settings->all()]);
    }

    public function update(UpdateSettingsRequest $request, BookingSettings $settings): JsonResponse
    {
        $settings->update($request->settings());

        return response()->json(['settings' => $settings->all()]);
    }
}
