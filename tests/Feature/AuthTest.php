<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

it('refuse les routes d’administration sans session', function (string $method, string $uri) {
    $this->json($method, $uri)->assertUnauthorized();
})->with([
    ['GET', '/api/bookings'],
    ['PUT', '/api/bookings/1'],
    ['DELETE', '/api/bookings/1'],
    ['POST', '/api/bookings/1/validate'],
    ['POST', '/api/bookings/1/cancel'],
    ['POST', '/api/bookings/1/pending'],
    ['GET', '/api/clients'],
    ['GET', '/api/clients/1'],
    ['PUT', '/api/clients/1'],
    ['DELETE', '/api/clients/1'],
    ['GET', '/api/payments'],
    ['POST', '/api/payments'],
    ['PUT', '/api/payments/1'],
    ['DELETE', '/api/payments/1'],
    ['POST', '/api/payments/1/confirm'],
    ['GET', '/api/bookings/1'],
    ['GET', '/api/dashboard'],
    ['GET', '/api/revenue'],
    ['GET', '/api/settings'],
    ['PUT', '/api/settings'],
    ['GET', '/api/users'],
    ['POST', '/api/users'],
    ['DELETE', '/api/users/1'],
    ['GET', '/api/user'],
    ['PUT', '/api/user/password'],
]);

it('connecte un administrateur sans exposer son mot de passe', function () {
    User::factory()->create(['login' => 'isabelle', 'password' => Hash::make('un-bon-mot-de-passe')]);

    $this->postJson('/api/login', ['login' => 'isabelle', 'password' => 'un-bon-mot-de-passe'])
        ->assertOk()
        ->assertJsonPath('user.login', 'isabelle')
        ->assertJsonMissingPath('user.password');

    $this->getJson('/api/user')->assertOk()->assertJsonPath('user.login', 'isabelle');
});

it('refuse un mauvais mot de passe avec un message unique', function () {
    User::factory()->create(['login' => 'isabelle']);

    $wrongPassword = $this->postJson('/api/login', ['login' => 'isabelle', 'password' => 'faux']);
    $unknownUser = $this->postJson('/api/login', ['login' => 'inconnu', 'password' => 'faux']);

    $wrongPassword->assertUnprocessable();
    expect($wrongPassword->json('message'))->toBe($unknownUser->json('message'));
    $this->assertGuest();
});

it('accepte un mot de passe de l’ancienne API et le convertit', function () {
    $user = User::factory()->create(['login' => 'admin']);
    // Hash au format de l'ancienne API, écrit sans passer par le cast « hashed »
    DB::table('users')->where('id', $user->id)->update([
        'password' => password_hash('admin'.'test-salt'.'secret', PASSWORD_BCRYPT, ['cost' => 10]),
    ]);

    $this->postJson('/api/login', ['login' => 'admin', 'password' => 'secret'])->assertOk();

    // Le hash est désormais au format Laravel : plus besoin du sel
    expect(Hash::check('secret', $user->fresh()->password))->toBeTrue();
});

it('limite les tentatives de connexion', function () {
    foreach (range(1, 5) as $attempt) {
        $this->postJson('/api/login', ['login' => 'x', 'password' => 'y']);
    }

    $this->postJson('/api/login', ['login' => 'x', 'password' => 'y'])->assertTooManyRequests();
});

it('ne permet de créer un administrateur qu’une fois connecté', function () {
    $payload = ['name' => 'Bastien', 'email' => 'b@example.com', 'login' => 'bastien', 'password' => 'Mot-de-passe-solide-42'];

    $this->postJson('/api/users', $payload)->assertUnauthorized();

    $this->actingAs(admin())->postJson('/api/users', $payload)
        ->assertCreated()
        ->assertJsonMissingPath('user.password');
});

it('ouvre la session quel que soit le domaine qui sert le site', function () {
    User::factory()->create(['login' => 'isabelle', 'password' => Hash::make('un-bon-mot-de-passe')]);

    $this->withHeader('Referer', 'https://www.tidolasab.com/admin/login')
        ->postJson('https://www.tidolasab.com/api/login', ['login' => 'isabelle', 'password' => 'un-bon-mot-de-passe'])
        ->assertOk();
});

it('change le mot de passe de l’administrateur connecté', function () {
    $user = User::factory()->create(['password' => Hash::make('ancien-mot-de-passe')]);

    $this->actingAs($user)->putJson('/api/user/password', [
        'current_password' => 'ancien-mot-de-passe',
        'password' => 'Nouveau-mot-de-passe-42',
        'password_confirmation' => 'Nouveau-mot-de-passe-42',
    ])->assertOk();

    expect(Hash::check('Nouveau-mot-de-passe-42', $user->fresh()->password))->toBeTrue();
});

it('refuse le changement de mot de passe sans le mot de passe actuel', function () {
    $user = User::factory()->create(['password' => Hash::make('ancien-mot-de-passe')]);

    $this->actingAs($user)->putJson('/api/user/password', [
        'current_password' => 'faux',
        'password' => 'Nouveau-mot-de-passe-42',
        'password_confirmation' => 'Nouveau-mot-de-passe-42',
    ])->assertUnprocessable()->assertJsonValidationErrors('current_password');

    $this->actingAs($user)->putJson('/api/user/password', [
        'current_password' => 'ancien-mot-de-passe',
        'password' => 'Nouveau-mot-de-passe-42',
        'password_confirmation' => 'autre-chose',
    ])->assertUnprocessable()->assertJsonValidationErrors('password');

    expect(Hash::check('ancien-mot-de-passe', $user->fresh()->password))->toBeTrue();
});

it('exige un mot de passe robuste et différent de l’actuel', function (string $password) {
    $user = User::factory()->create(['password' => Hash::make('Ancien-mot-de-passe-42')]);

    $this->actingAs($user)->putJson('/api/user/password', [
        'current_password' => 'Ancien-mot-de-passe-42',
        'password' => $password,
        'password_confirmation' => $password,
    ])->assertUnprocessable()->assertJsonValidationErrors('password');
})->with([
    'trop court' => 'Court-42',
    'sans majuscule' => 'sans-majuscule-42',
    'sans chiffre' => 'Sans-Chiffre-Ici',
    'sans symbole' => 'SansSymbole42abc',
    'identique' => 'Ancien-mot-de-passe-42',
]);
