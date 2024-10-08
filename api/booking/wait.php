<?php

require_once('../api.php');

global $data, $connexion;

try {
        $connexion->beginTransaction();

        $sql = "UPDATE reservations SET statut = 'en attente' WHERE id = :id;";
        $response = $connexion->safeExecute($sql, ['id' => $data->id]);

        $client = $connexion->safeFetch("SELECT c.* FROM clients c INNER JOIN reservations_clients rc ON c.id = rc.id_client AND rc.id_reservation = :id_reservation;", ['id_reservation' => $data->id]);

        // Send email to client
        $to = $client->email;
        $name = $client->nom . ' ' . $client->prenom;
        $subject = 'Tidolasab - Réservation en cours';
        $message = "<h4>Bonjour $name,</h4><p>Merci pour votre confiance.</p><p>Votre réservation est en cours de validation (en attente).</p>";
        sendEmail($to, $subject, $message);

        $connexion->commit();
        http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);