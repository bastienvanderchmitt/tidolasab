<?php

require_once('../api.php');

global $data, $connexion;

try {
        $connexion->beginTransaction();

        $sql = "UPDATE reservations SET etat_reservation = 'annulée' WHERE id_reservation = :id_reservation;";
        $response = $connexion->safeExecute($sql, ['id_reservation' => $data->id_reservation]);

        $client = $connexion->safeFetch("SELECT c.* FROM clients c INNER JOIN reservations_clients rc ON c.id_client = rc.id_client AND rc.id_reservation = :id_reservation;", ['id_reservation' => $data->id_reservation]);

        // Send email to client
        $to = $client->email_client;
        $subject = 'Tidolasab - Réservation annulée';
        $message = "<html><h4>Bonjour,</h4><p> merci pour votre confiance.</p><p>Malheureusement, votre réservation viens d'être annulée.</p></html>";
        sendEmail($to, $subject, $message, false);


        $connexion->commit();
        http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);