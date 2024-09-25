<?php

require_once('../api.php');

global $data, $connexion;

try {
        $connexion->beginTransaction();

        $sql = "UPDATE reservations SET statut = 'annulée' WHERE id = :id;";
        $response = $connexion->safeExecute($sql, ['id' => $data->id]);

        $client = $connexion->safeFetch("SELECT c.* FROM clients c INNER JOIN reservations_clients rc ON c.id = rc.id_client AND rc.id_reservation = :id_reservation;", ['id_reservation' => $data->id]);

        // Send email to client
        $to = $client->email;
        $subject = 'Tidolasab - Réservation annulée';
        $message = "<h4>Bonjour,</h4><p>Malheureusement, votre réservation viens d'être annulée.</p>";
        sendEmail($to, $subject, $message);


        $connexion->commit();
        http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);