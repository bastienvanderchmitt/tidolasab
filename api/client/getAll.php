<?php

require_once('../api.php');

global $connexion;

try {

    $result = ['clients' => $connexion->safeFetchAll("SELECT c.*, (NOT EXISTS(SELECT 1 FROM reservations_clients rc WHERE rc.id_client = c.id)) as can_delete FROM clients c ORDER BY c.nom;")];
    http_response_code(200);

} catch (Exception $e) {
    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);