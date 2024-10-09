<?php

require_once('../api.php');

global $data, $connexion;

try {
    $connexion->beginTransaction();

    $sql = "UPDATE reservations SET statut = 'validée' WHERE id = :id;";
    $response = $connexion->safeExecute($sql, ['id' => $data->id]);

    $sql = "INSERT INTO paiements SET id_reservation = :id, montant_paiement = :montant, date_paiement = :date, moyen_paiement = 'virement';";
    $response = $connexion->safeExecute($sql, ['id' => $data->id, 'montant' => $data->deposit, 'date' => $data->date]);

    $reservation = $connexion->safeFetch("SELECT c.*, r.* 
                                           FROM reservations r 
                                                INNER JOIN reservations_clients rc ON r.id = rc.id_reservation
                                                INNER JOIN clients c ON c.id = rc.id_client
                                           WHERE r.id = :id_reservation;",
        ['id_reservation' => $data->id]);

    // Send email to client
    $to = $reservation->email;
    $arrivee = $reservation->date_arrivee;
    $depart = $reservation->date_depart;
    $name = $reservation->nom . ' ' . $reservation->prenom;
    $nbr = (int)$reservation->adultes + (int)$reservation->enfants;
    $total = $reservation->prix_total;
    $deposit = $data->deposit;
    $rest = (float)$total - (float)$deposit;
    $dateArrivee = new DateTime($arrivee);
    $dateArrivee->modify('-14 days');
    $date_solde = $dateArrivee->format('Y-m-d');
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
                    <td>$total €</td>
                  </tr>
                  <tr>
                    <td>Acompte versé :</td>
                    <td>$deposit €</td>
                  </tr>
                  <tr>
                    <td>Solde à régler :</td>
                    <td>$rest €</td>
                  </tr>
                </table>
                <p>Solde à régler avant le $date_solde</p>";
    sendEmail($to, $subject, $message);

    $connexion->commit();

    $result = ['success' => true];
    http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);