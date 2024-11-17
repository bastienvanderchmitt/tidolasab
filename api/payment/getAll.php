<?php

require_once('../api.php');

global $connexion;

try {

    $result = ['payments' => $connexion->safeFetchAll("SELECT c.nom, c.prenom, p.* FROM paiements p 
            INNER JOIN reservations r ON r.id = p.id_reservation
            INNER JOIN reservations_clients rc ON r.id = rc.id_reservation
            INNER JOIN clients c ON c.id = rc.id_client
        ORDER BY date_paiement;
    ")];
    http_response_code(200);

} catch (Exception $e) {
    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);