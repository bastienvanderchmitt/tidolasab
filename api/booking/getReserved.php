<?php

require_once('../api.php');

global $connexion;

try {

    $result = ['bookings' => $connexion->safeFetchAll("SELECT * FROM reservations WHERE statut <> 'annulée' ORDER BY date_arrivee ASC;")];
    http_response_code(200);

} catch (Exception $e) {
    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);