<?php

require_once('../api.php');

global $connexion;

try {

    $result = ['bookings' => $connexion->safeFetchAll("SELECT CONCAT(c.nom, ' ', c.prenom) as nom_client, r.* FROM reservations r
                                                                INNER JOIN reservations_clients rc ON r.id = rc.id_reservation
                                                                INNER JOIN clients c ON c.id = rc.id_client;")];
    http_response_code(200);

} catch (Exception $e) {
    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);