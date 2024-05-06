<?php

require_once('../api.php');

global $data, $connexion;

try {

    $checkExisting = $connexion->safeFetchAll("SELECT * FROM reservations WHERE date_arrivee >= :date_arrivee AND date_depart <= :date_depart;", ['date_arrivee' => $data->checkIn, 'date_depart' => $data->checkOut]);

    if (!count($checkExisting)) {
        $connexion->beginTransaction();

        $sql = "INSERT INTO reservations SET date_arrivee = :date_arrivee, date_depart = :date_depart, nombre_nuits = :nombre_nuits, adultes = :adultes, enfants = :enfants, prix_total = :prix_total;";
        $response = $connexion->safeExecute($sql, ['date_arrivee' => $data->checkIn, 'date_depart' => $data->checkOut, 'nombre_nuits' => $data->days, 'adultes' => $data->adults, 'enfants' => $data->children, 'prix_total' => $data->total]);

        $bookingId = $connexion->lastInsertId();

        $sql = "INSERT INTO reservations_clients SET id_reservation = :id_reservation, id_client = :id_client;";
        $connexion->safeExecute($sql, ['id_reservation' => $bookingId, 'id_client' => $data->idClient]);

        $connexion->commit();

        $result = ['bookingId' => $bookingId];
        http_response_code(200);
    } else {
        throw new Exception('Une réservation est déjà en cours sur cette plage de dates, veuillez actualiser la page.');
    }

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);