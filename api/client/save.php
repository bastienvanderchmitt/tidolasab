<?php

require_once('../api.php');

global $data, $connexion;

try {
    $connexion->beginTransaction();

    $address = $data->address . ", " . $data->postalCode . " " . $data->city . ", " . $data->country;
    $sql = "INSERT INTO clients SET nom_client = :nom_client, prenom_client = :prenom_client, email_client = :email_client, telephone_client = :telephone_client, adresse_client = :adresse_client;";
    $response = $connexion->safeExecute($sql, ['nom_client' => $data->name, 'prenom_client' => $data->firstName, 'email_client' => $data->email, 'telephone_client' => $data->phone, 'adresse_client' => $address]);
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