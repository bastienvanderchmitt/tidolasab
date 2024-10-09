<?php

require_once('../api.php');

global $data, $connexion;

try {
    $connexion->beginTransaction();

    $sql = "DELETE FROM paiements WHERE id = :id;";
    $response = $connexion->safeExecute($sql, ['id' => $data->id]);

    $connexion->commit();
    $result = ['success' => true];
    http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);