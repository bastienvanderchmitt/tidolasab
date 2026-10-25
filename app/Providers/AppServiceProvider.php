<?php

namespace App\Providers;

use App\Services\BookingSettings;
use Illuminate\Foundation\DevCommands;
use Illuminate\Support\ServiceProvider;

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
        // « php artisan dev » : pas de worker, la file d'attente est synchrone
        DevCommands::except('queue');
    }
}
