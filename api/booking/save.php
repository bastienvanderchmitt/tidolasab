<?php

require_once('../api.php');

global $data, $connexion;

function areDatesChristmasHolidaysValid($date1, $date2) {
    // Convertir les dates en objets DateTime
    $startDate = new DateTime('2024-12-21');
    $endDate = new DateTime('2025-01-06');
    $d1 = new DateTime($date1);
    $d2 = new DateTime($date2);

    // Vérifier si les dates sont dans l'intervalle
    if ($d1 >= $startDate && $d2 <= $endDate) {
        $interval = $d1->diff($d2);
        return $interval->days >= 4 && $interval->invert == 0; // >= 4 jours et d1 <= d2
    } else {
        return true;
    }
}

try {

    if (!areDatesChristmasHolidaysValid($data->checkIn, $data->checkOut))
        throw new Exception('Durée de séjour de 4 nuits minimum pour la période Noël / Nouvel an.');

    $checkExisting = $connexion->safeFetchAll("
        SELECT * FROM reservations 
                 WHERE statut = :statut AND 
                       (:date_arrivee BETWEEN date_arrivee AND (date_depart - INTERVAL 1 DAY) OR 
                        :date_depart BETWEEN (date_arrivee + INTERVAL 1 DAY) AND date_depart);",
        [
            'date_arrivee' => $data->checkIn,
            'date_depart' => $data->checkOut,
            'statut' => 'validée'
        ]
    );

    if (!count($checkExisting)) {
        $connexion->beginTransaction();

        $total = $data->type !== 'Fermeture' ? $data->total : 0;
        $sql = "INSERT INTO reservations SET date_arrivee = :date_arrivee, date_depart = :date_depart, nombre_nuits = :nombre_nuits, adultes = :adultes, enfants = :enfants, prix_total = :prix_total, type = :type;";
        $response = $connexion->safeExecute($sql, ['date_arrivee' => $data->checkIn, 'date_depart' => $data->checkOut, 'nombre_nuits' => $data->days, 'adultes' => $data->adults, 'enfants' => $data->children, 'prix_total' => $total, 'type' => $data->type]);
        $bookingId = $connexion->lastInsertId();

        if ($data->type === "Fermeture") {
            $sql = "UPDATE reservations SET statut = :statut WHERE id = :id_reservation;";
            $connexion->safeExecute($sql, ['statut' => 'validée', 'id_reservation' => $bookingId]);
        } else {
            $address = !empty($data->address) ? $data->address : '';

            if (!empty($data->postalCode) || !empty($data->city)) {
                if (!empty($data->postalCode)) {
                    $address .= !empty($data->address) ? ", " . $data->postalCode : $data->postalCode;
                    $address .= !empty($data->city) ? " " . $data->city : '';
                } else {
                    $address .= !empty($data->address) ? ", " . $data->city : $data->city;
                }
            }

            if (!empty($data->country)) {
                $address .= (!empty($data->address) || !empty($data->postalCode) || !empty($data->city)) ? ", " . $data->country : $data->country;
            }

            $sql = "INSERT INTO clients SET nom = :nom, prenom = :prenom, email = :email, telephone = :telephone, adresse = :adresse, language = :language;";
            $response = $connexion->safeExecute($sql, ['nom' => $data->name, 'prenom' => $data->firstName, 'email' => $data->email, 'telephone' => $data->phone, 'adresse' => $address, 'language' => $data->language]);
            $clientId = $connexion->lastInsertId();

            $sql = "INSERT INTO reservations_clients SET id_reservation = :id_reservation, id_client = :id_client;";
            $connexion->safeExecute($sql, ['id_reservation' => $bookingId, 'id_client' => $clientId]);
        }

        // Send email with RIB to client
        $to = $data->email;
        $amount = (int)$data->total / 2;
        $subject = $data->language === 'fr' ? 'Tidolasab - Réservation en cours' : 'Tidolasab - Booking in progess';
        $message = $data->language === 'fr' ? "<h4>Bonjour,</h4>
                    <p>Nous vous remercions pour votre confiance.</p>
                    <p>Votre réservation est en cours de validation.</p>
                    <p>Votre séjour vous sera confirmé à réception de votre contrat ci-joint signé et de votre acompte de 50% ($amount €).</p>
                    <p>Le solde restant vous sera demandé 14 jours avant l'arrivée.</p>
                    <p>Pour tout renseignement supplémentaire, n'hésitez pas à nous contacter au <a href=\"tel:0690648904\">06 90 64 89 04</a> ou à <a href=\"mailto:tidolasab@gmail.com\">tidolasab@gmail.com</a>.</p>
                    <p>Cordialement,</p>
                    <p>Ti' Dola Sab</p>" :
                        "<h4>Hello,</h4>
                        <p>Thank you for your trust.</p>
                        <p>Your booking is being processed.</p>
                        <p>Your stay will be confirmed upon receipt of your signed contract attached and your deposit of 50% ($amount €).</p>
                        <p>The remaining balance will be requested 14 days before arrival.</p>
                        <p>For any additional information, please feel free to contact us at <a href=\"tel:0690648904\">06 90 64 89 04</a> or at <a href=\"mailto:tidolasab@gmail.com\">tidolasab@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>Ti' Dola Sab</p>";
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