<?php

use Illuminate\Support\Facades\Schedule;

// Lancé par le cron LWS : « php artisan schedule:run » chaque minute,
// ou directement « php artisan reminders:send » une fois par jour.
Schedule::command('reminders:send')->dailyAt('09:00');
