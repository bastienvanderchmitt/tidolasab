<?php

require_once('../api.php');

global $data, $connexion;

try {
    $connexion->beginTransaction();

    $sql = "UPDATE clients SET nom = :nom, prenom = :prenom, email = :email, telephone = :telephone, adresse = :adresse WHERE id = :id;";
    $response = $connexion->safeExecute($sql, ['id' => $data->id, 'nom' => $data->name, 'prenom' => $data->firstName, 'email' => $data->email, 'telephone' => $data->phone, 'adresse' => $data->address]);
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