<?php

use Illuminate\Support\Facades\Schedule;

// Lancé par le cron LWS : « php artisan schedule:run » chaque minute.
Schedule::command('reminders:send')->dailyAt('09:00');

// Envoi des emails en file d'attente : LWS ne garde pas de processus en continu,
// la file est donc vidée chaque minute
Schedule::command('queue:work --stop-when-empty --max-time=50')->everyMinute()->withoutOverlapping();

// Suivi des emails conservé deux ans, échecs de la file trente jours
Schedule::command('model:prune')->daily();
Schedule::command('queue:prune-failed --hours=720')->weekly();
