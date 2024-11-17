<?php

require_once('../api.php');

global $data, $connexion;

try {
    $connexion->beginTransaction();

    $bookings = $connexion->safeFetchAll("SELECT 1 FROM reservations_clients WHERE id_client = :id;", ['id' => $data->id]);

    if (empty($bookings)) {
        $sql = "DELETE FROM clients WHERE id = :id;";
        $response = $connexion->safeExecute($sql, ['id' => $data->id]);

        $connexion->commit();
        $result = ['success' => true];
    } else {
        $result = ['success' => false, 'message' => "Une réservation existe pour ce client, veuillez la supprimer."];
    }

    http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);