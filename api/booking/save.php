<?php

require_once('../api.php');

global $data, $connexion;

try {
    $checkExisting = $connexion->safeFetchAll("SELECT * FROM reservations WHERE :date_arrivee BETWEEN date_arrivee AND date_depart OR :date_depart BETWEEN date_arrivee AND date_depart;", ['date_arrivee' => $data->checkIn, 'date_depart' => $data->checkOut]);

    if (!count($checkExisting)) {
        $connexion->beginTransaction();

        $address = $data->address . ", " . $data->postalCode . " " . $data->city . ", " . $data->country;
        $sql = "INSERT INTO clients SET nom_client = :nom_client, prenom_client = :prenom_client, email_client = :email_client, telephone_client = :telephone_client, adresse_client = :adresse_client;";
        $response = $connexion->safeExecute($sql, ['nom_client' => $data->name, 'prenom_client' => $data->firstName, 'email_client' => $data->email, 'telephone_client' => $data->phone, 'adresse_client' => $address]);
        $clientId = $connexion->lastInsertId();

        $sql = "INSERT INTO reservations SET date_arrivee = :date_arrivee, date_depart = :date_depart, nombre_nuits = :nombre_nuits, adultes = :adultes, enfants = :enfants, prix_total = :prix_total;";
        $response = $connexion->safeExecute($sql, ['date_arrivee' => $data->checkIn, 'date_depart' => $data->checkOut, 'nombre_nuits' => $data->days, 'adultes' => $data->adults, 'enfants' => $data->children, 'prix_total' => $data->total]);
        $bookingId = $connexion->lastInsertId();

        $sql = "INSERT INTO reservations_clients SET id_reservation = :id_reservation, id_client = :id_client;";
        $connexion->safeExecute($sql, ['id_reservation' => $bookingId, 'id_client' => $clientId]);

        // Send email with RIB to client
        $to = $data->email;
        $subject = 'Tidolasab - Réservation en cours';
        $message = "<html><h4>Bonjour,</h4><p> merci pour votre confiance.</p><p>Votre réservation est en cours de validation. Voici le RIB en PJ.</p></html>";
        sendEmail($to, $subject, $message, true);

        // Send email to admin
//        $to = "tidolasab@gmail.com";
        $to = "bastienvanderchmitt@gmail.com";
        $subject = 'Nouvelle réservation !';
        $message = "<html>
                        <h4><a href='https://tidolasab/admin/booking/$bookingId'>Réservation</a> de $data->name $data->firstName</h4>
                        <ul>
                            <li>Du $data->checkIn au $data->checkOut ($data->days nuits)</li>
                            <li>$data->adults adultes, $data->children enfants</li>
                            <li>Pour un total de $data->total €</li>
                        </ul>
                        <h5>Informations client :</h5>
                        <ul>
                            <li>Email : $data->email</li>
                            <li>Téléphone : $data->phone</li>
                            <li>Adresse : $address</li>
                        </ul>
                    </html>";
        sendEmail($to, $subject, $message);

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