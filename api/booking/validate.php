<?php

require_once('../api.php');

global $data, $connexion;

try {
    $connexion->beginTransaction();

    $sql = "UPDATE reservations SET statut = 'validée' WHERE id = :id;";
    $response = $connexion->safeExecute($sql, ['id' => $data->id]);

    $sql = "INSERT INTO paiements SET id_reservation = :id, montant_paiement = :montant, date_paiement = :date, moyen_paiement = :moyen_paiement;";
    $response = $connexion->safeExecute($sql, ['id' => $data->id, 'montant' => $data->deposit, 'date' => $data->date, 'moyen_paiement' => $data->type]);

    $reservation = $connexion->safeFetch("SELECT c.*, r.* 
                                           FROM reservations r 
                                                LEFT JOIN reservations_clients rc ON r.id = rc.id_reservation
                                                LEFT JOIN clients c ON c.id = rc.id_client
                                           WHERE r.id = :id_reservation;",
        ['id_reservation' => $data->id]);

    // Send email to client
    if (!empty($reservation->email) && $reservation->type === 'Classique') {
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
        $subject = $reservation->language === 'fr' ? 'Tidolasab - Réservation validée !' : 'Tidolasab - Booking validated !';
        $message = $reservation->language === 'fr' ? "<p>Bonjour $name,</p>
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
                <p>Solde à régler avant le $date_solde</p>
                <p>Pour tout renseignement supplémentaire, n'hésitez pas à nous contacter au <a href=\"tel:0690648904\">06 90 64 89 04</a> ou à <a href=\"mailto:tidolasab@gmail.com\">tidolasab@gmail.com</a>.</p>
                <p>Cordialement,</p>
                <p>Ti' Dola Sab</p>" :
            "<p>Hello $name,</p>
                    <p>We are pleased to confirm your booking.</p>
                    <table>
                      <tr>
                        <th>Details</th>
                      </tr>
                      <tr>
                        <td>Number of people:</td>
                        <td>$nbr</td>
                      </tr>
                      <tr>
                        <td>Arrival date:</td>
                        <td>$arrivee</td>
                      </tr>
                      <tr>
                        <td>Departure date:</td>
                        <td>$depart</td>
                      </tr>
                      <tr>
                        <td>Total price:</td>
                        <td>$total €</td>
                      </tr>
                      <tr>
                        <td>Deposit paid:</td>
                        <td>$deposit €</td>
                      </tr>
                      <tr>
                        <td>Balance to be paid:</td>
                        <td>$rest €</td>
                      </tr>
                    </table>
                    <p>Balance to be paid by $date_solde</p>
                    <p>For any additional information, please feel free to contact us at <a href=\"tel:0690648904\">06 90 64 89 04</a> or at <a href=\"mailto:tidolasab@gmail.com\">tidolasab@gmail.com</a>.</p>
                    <p>Best regards,</p>
                    <p>Ti' Dola Sab</p>";
        sendEmail($to, $subject, $message);
    }

    $connexion->commit();

    $result = ['success' => true];
    http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);