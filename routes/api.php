<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\StatisticsController;
use Illuminate\Support\Facades\Route;

// Site public
Route::get('bookings/reserved', [BookingController::class, 'reserved']);
Route::get('pricing', [PricingController::class, 'show']);
Route::get('pricing/quote', [PricingController::class, 'quote'])->middleware('throttle:60,1');
Route::post('bookings', [BookingController::class, 'store'])->middleware('throttle:10,1');
Route::post('contact', [ContactController::class, 'send'])->middleware('throttle:5,1');
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Administration
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('users', [AuthController::class, 'store']);

    Route::get('bookings', [BookingController::class, 'index']);
    Route::put('bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('bookings/{booking}', [BookingController::class, 'destroy']);
    Route::post('bookings/{booking}/validate', [BookingController::class, 'validateBooking']);
    Route::post('bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    Route::post('bookings/{booking}/pending', [BookingController::class, 'pending']);

    Route::get('clients', [ClientController::class, 'index']);
    Route::get('clients/{client}', [ClientController::class, 'show']);
    Route::put('clients/{client}', [ClientController::class, 'update']);
    Route::delete('clients/{client}', [ClientController::class, 'destroy']);

    Route::get('payments', [PaymentController::class, 'index']);
    Route::post('payments', [PaymentController::class, 'store']);
    Route::put('payments/{payment}', [PaymentController::class, 'update']);
    Route::delete('payments/{payment}', [PaymentController::class, 'destroy']);

    Route::get('statistics', [StatisticsController::class, 'index']);
});
