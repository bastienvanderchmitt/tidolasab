<?php

use Illuminate\Support\Facades\Route;

// Administration (application React séparée, routeur sous /admin)
Route::view('/admin/{any?}', 'admin')->where('any', '.*');

// Site public : toutes les autres URL hors /api sont gérées par le routeur front
Route::view('/{any?}', 'app')->where('any', '^(?!api|sanctum|up|admin).*$');
