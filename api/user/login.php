<?php

require_once '../../vendor/autoload.php';
require_once('../api.php');

use \Firebase\JWT\JWT;

global $data, $connexion;

/**
 * Fonction pour générer un token JWT
 **/
function generate_jwt($user) {
    $secret_key = 'bGS6lzFqvvSQ8ALbOxatm7/Vk7mLQyzqaS34Q4oR1ew=';
    $issued_at = new DateTimeImmutable();
    $expire = $issued_at->modify('+1 hour')->getTimestamp();
    $server_name = "http://localhost:3000/";

    $data = [
        'iat' => $issued_at->getTimestamp(),
        'iss' => $server_name,
        'nbf' => $issued_at->getTimestamp(),
        'exp' => $expire,
        'user' => $user,
    ];

    return JWT::encode($data, $secret_key,'HS256');
}

try {

    // Get posted data
    $login = $data->login;
    $password = $data->password;
    $password_bcrypt = $login.SALT.trim($password);

    $user = $connexion->safeFetch("SELECT * FROM users WHERE login = :login;", ['login' => $login]);

    // Validate user credentials
    if (!$user) {

        $result = ['error' => 'Utilisateur inconnu'];
        http_response_code(400);

    } else if (password_verify($password_bcrypt, $user->password)) {

        // Generate JWT token
        $jwt = generate_jwt($user);
        $result = ['token' => $jwt, 'user' => $user];
        http_response_code(200);

    } else {

        $result = ['error' => 'Mot de passe erroné'];
        http_response_code(400);
    }

} catch (Exception $e) {

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);