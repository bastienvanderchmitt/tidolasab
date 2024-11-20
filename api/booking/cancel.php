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
    if ($to) {
        if ($client->language === 'fr') {
            $subject = 'Tidolasab - Réservation annulée';
            $message = "<h4>Bonjour,</h4><p>Malheureusement, votre réservation viens d'être annulée.</p><p>Pour tout renseignement supplémentaire, n'hésitez pas à nous contacter au <a href=\"tel:0690648904\">06 90 64 89 04</a> ou à <a href=\"mailto:tidolasab@gmail.com\">tidolasab@gmail.com</a>.</p>
                        <p>Cordialement,</p>
                        <p>Ti' Dola Sab</p>";
        } else {
            $subject = 'Tidolasab - Booking Cancelled';
            $message = "<h4>Hello,</h4><p>Unfortunately, your booking has just been cancelled.</p><p>For any additional information, please feel free to contact us at <a href=\"tel:0690648904\">06 90 64 89 04</a> or at <a href=\"mailto:tidolasab@gmail.com\">tidolasab@gmail.com</a>.</p>
                            <p>Best regards,</p>
                            <p>Ti' Dola Sab</p>";
        }
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