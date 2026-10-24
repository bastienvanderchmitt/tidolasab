<?php

use Illuminate\Support\Facades\Route;

// Application React : toutes les URL hors /api sont gérées par le routeur front
Route::view('/{any?}', 'app')->where('any', '^(?!api|sanctum|up).*$');
