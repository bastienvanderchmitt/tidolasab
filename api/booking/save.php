<?php

require_once('../api.php');

global $data, $connexion;

try {
    $checkExisting = $connexion->safeFetchAll("SELECT * FROM reservations WHERE statut = :statut AND (:date_arrivee BETWEEN date_arrivee AND date_depart OR :date_depart BETWEEN date_arrivee AND date_depart);", ['date_arrivee' => $data->checkIn, 'date_depart' => $data->checkOut, 'statut' => 'validée']);
    if (!count($checkExisting)) {
        $connexion->beginTransaction();

        $address = $data->address . ", " . $data->postalCode . " " . $data->city . ", " . $data->country;
        $sql = "INSERT INTO clients SET nom = :nom, prenom = :prenom, email = :email, telephone = :telephone, adresse = :adresse;";
        $response = $connexion->safeExecute($sql, ['nom' => $data->name, 'prenom' => $data->firstName, 'email' => $data->email, 'telephone' => $data->phone, 'adresse' => $address]);
        $clientId = $connexion->lastInsertId();

        $sql = "INSERT INTO reservations SET date_arrivee = :date_arrivee, date_depart = :date_depart, nombre_nuits = :nombre_nuits, adultes = :adultes, enfants = :enfants, prix_total = :prix_total;";
        $response = $connexion->safeExecute($sql, ['date_arrivee' => $data->checkIn, 'date_depart' => $data->checkOut, 'nombre_nuits' => $data->days, 'adultes' => $data->adults, 'enfants' => $data->children, 'prix_total' => $data->total]);
        $bookingId = $connexion->lastInsertId();

        $sql = "INSERT INTO reservations_clients SET id_reservation = :id_reservation, id_client = :id_client;";
        $connexion->safeExecute($sql, ['id_reservation' => $bookingId, 'id_client' => $clientId]);

        // Send email with RIB to client
        $to = $data->email;
        $amount = (int)$data->total / 2;
        $subject = 'Tidolasab - Réservation en cours';
        $message = "<h4>Bonjour,</h4>
                    <p>Nous vous remercions pour votre confiance.</p>
                    <p>Votre réservation est en cours de validation.</p>
                    <p>Votre séjour vous sera confirmé à réception de votre contrat ci-joint signé et de votre acompte de 50% ($amount €).</p>
                    <p>Le solde restant vous sera demandé 14 jours avant l'arrivée.</p>";
        if (!$data->isAdmin)
            sendEmail($to, $subject, $message, true, true);

        // Send email to admin
        $to = "tidolasab@gmail.com";
        $subject = 'Nouvelle réservation !';
        $message = "<h4><a href='https://tidolasab/admin/booking/$bookingId'>Réservation</a> de $data->name $data->firstName</h4>
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
                    </ul>";
        if (!$data->isAdmin)
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