<?php

require_once('../api.php');

global $data, $connexion;

try {
        $connexion->beginTransaction();

        $sql = "UPDATE reservations SET statut = 'validée' WHERE id = :id;";
        $response = $connexion->safeExecute($sql, ['id' => $data->id]);

        $reservation = $connexion->safeFetch("SELECT c.*, r.* 
                                               FROM reservations r 
                                                    INNER JOIN reservations_clients rc ON r.id = rc.id_reservation
                                                    INNER JOIN clients c ON c.id = rc.id_client
                                               WHERE r.id = :id_reservation;",
            ['id_reservation' => $data->id]);

        // Send email to client
        $to = $reservation->email;
        $arrivee = $reservation->date_arrivee;
        $depart = $reservation->depart;
        $name = $reservation->nom + $reservation->prenom;
        $nbr = $reservation->adultes + $reservation->enfants;
        $total = $reservation->prix_total;
        $subject = 'Tidolasab - Réservation validée !';
        $message = "<p>Bonjour $name,</p>
                    <p>Nous sommes ravis de vous confirmer votre réservation.</p>
                    <table>
                      <tr>
                        <th>Détails</th>
                      </tr>
                      <tr>
                        <td>Nombre de personnes :</td>
                        <td>$nbr</td>
                      </tr>
                      <tr>
                        <td>Date d'arrivée :</td>
                        <td>$arrivee</td>
                      </tr>
                      <tr>
                        <td>Date de départ :</td>
                        <td>$depart</td>
                      </tr>
                      <tr>
                        <td>Prix total :</td>
                        <td>$total</td>
                      </tr>
                    </table>
                    <table>
                      <tr>
                        <td>Acompte versé :</td>
                        <td>$nbr</td>
                      </tr>
                      <tr>
                        <td>Solde à régler :</td>
                        <td>$nbr</td>
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