<?php

namespace App\Providers;

use App\Services\BookingSettings;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Réglages lus une fois par requête
        $this->app->scoped(BookingSettings::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Mots de passe des administrateurs (création et changement)
        Password::defaults(fn () => Password::min(12)->mixedCase()->numbers()->symbols());
    }
}
