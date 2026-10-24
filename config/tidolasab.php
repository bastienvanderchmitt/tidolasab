<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Contacts
    |--------------------------------------------------------------------------
    */

    'admin_email' => env('TIDOLASAB_ADMIN_EMAIL', 'tidolasab@gmail.com'),
    'contact_phone' => env('TIDOLASAB_CONTACT_PHONE', '06 90 64 89 04'),

    /*
    |--------------------------------------------------------------------------
    | Tarifs
    |--------------------------------------------------------------------------
    |
    | Prix par nuit selon l'année de la date d'arrivée : on prend la dernière
    | entrée dont « from_year » est inférieure ou égale à cette année.
    | La basse saison couvre septembre et octobre, le reste est haute saison.
    |
    */

    'rates' => [
        ['from_year' => 0, 'low' => 100, 'high' => 110],
        ['from_year' => 2027, 'low' => 105, 'high' => 115],
    ],

    'low_season_months' => [9, 10],

    // Taxe de séjour par adulte et par nuit
    'tourist_tax' => 2,

    // Une demi-nuit offerte par tranche de 7 nuits
    'discount_nights_threshold' => 7,

    'minimum_nights' => 2,

    // Durée minimale sur certaines périodes (dates incluses)
    'minimum_stay_periods' => [
        ['start' => '2026-12-21', 'end' => '2027-01-06', 'nights' => 4],
    ],

    // Acompte demandé à la réservation (en pourcentage du total)
    'deposit_percent' => 50,

    // Nombre de jours avant l'arrivée pour le paiement du solde
    'balance_due_days' => 14,

    /*
    |--------------------------------------------------------------------------
    | Documents joints aux emails
    |--------------------------------------------------------------------------
    */

    'documents' => [
        'rib' => public_path('rib.pdf'),
        'contract' => public_path('contrat_location.pdf'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Comptes hérités de l'ancienne API
    |--------------------------------------------------------------------------
    |
    | Les mots de passe ont été hachés sous la forme login.SALT.password.
    | Ils sont convertis au format Laravel à la première connexion réussie.
    |
    */

    'legacy_password_salt' => env('LEGACY_PASSWORD_SALT'),

];
