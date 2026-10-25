<?php

use App\Models\User;
use App\Services\EmailVerification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature', 'Unit');

function admin(): User
{
    return User::factory()->create();
}

/**
 * Code de confirmation valide pour une réservation publique, comme si le client
 * l'avait reçu par email.
 */
function verificationCode(string $email): string
{
    return app(EmailVerification::class)->issue($email);
}
