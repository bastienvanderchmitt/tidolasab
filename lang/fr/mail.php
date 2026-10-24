<?php

return [
    'hello' => 'Bonjour,',
    'hello_name' => 'Bonjour :name,',
    'contact' => 'Pour tout renseignement supplémentaire, n\'hésitez pas à nous contacter au <a href="tel::phone_link">:phone</a> ou à <a href="mailto::email">:email</a>.',
    'regards' => 'Cordialement,',
    'signature' => 'Ti\' Dola Sab',

    'received' => [
        'subject' => 'Tidolasab - Réservation en cours',
        'thanks' => 'Nous vous remercions pour votre confiance.',
        'processing' => 'Votre réservation est en cours de validation.',
        'deposit' => 'Votre séjour vous sera confirmé à réception de votre contrat ci-joint signé et de votre acompte de :percent% (:amount €).',
        'full_payment' => 'Votre séjour vous sera confirmé à réception de votre contrat ci-joint signé et du règlement de la totalité du séjour (:amount €), votre arrivée ayant lieu dans moins de :days jours.',
        'balance' => 'Le solde restant vous sera demandé :days jours avant l\'arrivée.',
    ],

    'pending' => [
        'subject' => 'Tidolasab - Réservation en cours',
        'thanks' => 'Merci pour votre confiance.',
        'processing' => 'Votre réservation est en cours de validation (en attente).',
    ],

    'validated' => [
        'subject' => 'Tidolasab - Réservation validée !',
        'intro' => 'Nous sommes ravis de vous confirmer votre réservation.',
        'details' => 'Détails',
        'people' => 'Nombre de personnes :',
        'arrival' => 'Date d\'arrivée :',
        'departure' => 'Date de départ :',
        'total' => 'Prix total :',
        'deposit' => 'Acompte versé :',
        'balance' => 'Solde à régler :',
        'fully_paid' => 'Votre séjour est intégralement réglé, merci !',
        'balance_due' => 'Solde à régler avant le :date',
    ],

    'cancelled' => [
        'subject' => 'Tidolasab - Réservation annulée',
        'body' => 'Malheureusement, votre réservation vient d\'être annulée.',
    ],

    'reminder' => [
        'subject' => 'Rappel de paiement pour votre réservation',
        'intro' => 'Nous vous rappelons que votre réservation arrive dans :days jours.',
        'balance' => 'Si vous n\'avez pas réglé la totalité de la réservation, merci de bien vouloir nous verser le solde restant d\'un montant de :amount €.',
        'ignore' => 'Si c\'est déjà le cas, ne pas tenir compte de cet email.',
        'regards' => 'Au plaisir de vous recevoir,',
        'host' => 'Isabelle',
    ],
];
