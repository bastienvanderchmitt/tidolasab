<?php

require_once('../api.php');

global $connexion;

try {

    $result = ['clients' => $connexion->safeFetchAll("SELECT * FROM clients;")];
    http_response_code(200);

} catch (Exception $e) {
    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);