<?php

require_once('../api.php');

global $data, $connexion;

try {

    $connexion->beginTransaction();

    $total = $data->type !== 'Fermeture' ? $data->total : 0;
    $sql = "UPDATE reservations SET date_arrivee = :date_arrivee, date_depart = :date_depart, nombre_nuits = :nombre_nuits, adultes = :adultes, enfants = :enfants, prix_total = :prix_total, type = :type WHERE id = :id;";
    $response = $connexion->safeExecute($sql, ['id' => $data->id, 'date_arrivee' => $data->checkIn, 'date_depart' => $data->checkOut, 'nombre_nuits' => $data->days, 'adultes' => $data->adults, 'enfants' => $data->children, 'prix_total' => $total, 'type' => $data->type]);
    $bookingId = $connexion->lastInsertId();

    if ($data->type === "Fermeture") {
        $sql = "UPDATE reservations SET statut = :statut WHERE id = :id_reservation;";
        $connexion->safeExecute($sql, ['statut' => 'validée', 'id_reservation' => $bookingId]);
    }

    $connexion->commit();

    $result = ['bookingId' => $bookingId];
    http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);