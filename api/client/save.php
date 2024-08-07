<?php

require_once('../api.php');

global $data, $connexion;

try {
    $connexion->beginTransaction();

    $address = $data->address . ", " . $data->postalCode . " " . $data->city . ", " . $data->country;
    $sql = "INSERT INTO clients SET nom = :nom, prenom = :prenom, email = :email, telephone = :telephone, adresse = :adresse;";
    $response = $connexion->safeExecute($sql, ['nom' => $data->name, 'prenom' => $data->firstName, 'email' => $data->email, 'telephone' => $data->phone, 'adresse' => $address]);
    $clientId = $connexion->lastInsertId();

    $connexion->commit();

    $result = ['clientId' => $clientId];
    http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);