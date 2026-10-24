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
    ['GET', '/api/statistics'],
    ['POST', '/api/users'],
    ['GET', '/api/user'],
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
    $payload = ['name' => 'Bastien', 'email' => 'b@example.com', 'login' => 'bastien', 'password' => 'mot-de-passe-solide'];

    $this->postJson('/api/users', $payload)->assertUnauthorized();

    $this->actingAs(admin())->postJson('/api/users', $payload)
        ->assertCreated()
        ->assertJsonMissingPath('user.password');
});
