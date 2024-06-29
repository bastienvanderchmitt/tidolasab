<?php

require_once('../api.php');

global $data, $connexion;

try {
        $connexion->beginTransaction();

        $sql = "UPDATE reservations SET etat_reservation = 'validée' WHERE id_reservation = :id_reservation;";
        $response = $connexion->safeExecute($sql, ['id_reservation' => $data->id_reservation]);

        $client = $connexion->safeFetch("SELECT c.* FROM clients c INNER JOIN reservations_clients rc ON c.id_client = rc.id_client AND rc.id_reservation = :id_reservation;", ['id_reservation' => $data->id_reservation]);

        // Send email to client
        $to = $client->email_client;
        $subject = 'Tidolasab - Réservation validée !';
        $message = "<p>Bonjour [Nom du client],</p>
                    <p>Nous sommes ravis de vous confirmer votre réservation de gîte pour les dates du [Date d'arrivée] au [Date de départ].</p>
                    <table>
                      <tr>
                        <th>Détails de la réservation</th>
                      </tr>
                      <tr>
                        <td>Nombre de personnes :</td>
                        <td>[Nombre de personnes]</td>
                      </tr>
                      <tr>
                        <td>Date d'arrivée :</td>
                        <td>[Date d'arrivée]</td>
                      </tr>
                      <tr>
                        <td>Date de départ :</td>
                        <td>[Date de départ]</td>
                      </tr>
                      <tr>
                        <td>Prix total :</td>
                        <td>[Prix total]</td>
                      </tr>
                    </table>";
        sendEmail($to, $subject, $message);

        $connexion->commit();
        http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);