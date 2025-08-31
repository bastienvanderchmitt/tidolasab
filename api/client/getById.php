<?php

require_once('../api.php');

global $connexion;

try {
    $client = $connexion->safeFetch("SELECT c.* FROM clients c WHERE c.id = :id;", ['id' => $_GET['id']]);
    $client->bookings = $connexion->safeFetchAll("SELECT r.* FROM reservations r
                                                                INNER JOIN reservations_clients rc ON r.id = rc.id_reservation AND rc.id_client = :id
                                                              ORDER BY date_arrivee DESC;", ['id' => $_GET['id']]);
    $client->payments = $connexion->safeFetchAll("SELECT p.* FROM paiements p
                                                                INNER JOIN reservations_clients rc ON p.id_reservation = rc.id_reservation AND rc.id_client = :id
                                                              ORDER BY date_paiement DESC;", ['id' => $_GET['id']]);
    $result = ['client' => $client];
    http_response_code(200);

} catch (Exception $e) {
    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);