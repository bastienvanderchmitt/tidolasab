<?php

require_once '../../vendor/autoload.php';
require_once('../api.php');

global $data, $connexion;

try {

    // Get posted data
    $name = $data->name;
    $email = $data->email;
    $login = $data->login;
    $password = $data->password;

    $password_bcrypt = password_hash($login.SALT.trim($password), PASSWORD_BCRYPT);
    $connexion->safeExecute(
        "INSERT INTO users SET name = :name, email = :email, password = :password, login = :login;",
        ['name' => $name,'email' => $email, 'login' => $login, 'password' => $password_bcrypt]
    );

    $result = ['user' => ['login' => $login, 'password' => $password_bcrypt]];
    http_response_code(200);

} catch (Exception $e) {

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);