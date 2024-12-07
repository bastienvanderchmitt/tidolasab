<?php

require_once(__DIR__ . '/../config.php');

try {
    global $connexion;

    // Date actuelle
    $currentDate = new DateTime();
    $reminderDate = (clone $currentDate)->modify('+14 days');

    // Requête pour trouver les réservations avec une date d'arrivée dans 14 jours
    $clients = $connexion->safeFetchAll("SELECT c.email, r.date_arrivee
        FROM reservations r
        INNER JOIN tidolasab.reservations_clients rc ON rc.id_reservation = r.id
        INNER JOIN clients c ON rc.id_client = c.id
        WHERE r.date_arrivee = :date_arrivee AND statut = 'validée' AND type <> 'Fermeture'", ['date_arrivee' => $reminderDate->format('Y-m-d')]);

    // Envoi des e-mails de rappel
    foreach ($clients as $client) {
        $to = $client->email;
        if (isset($to)) {
            $subject = "Rappel de paiement pour votre réservation";
            $message = "<h4>Bonjour,</h4>
                    <p>Nous vous rappelons que votre réservation arrive dans 14 jours.</p>
                    <p>Si vous n'avez pas réglé la totalité de la réservation, merci de nous verser le solde restant.</p>
                    <p>Si c'est déjà le cas, merci de ne pas tenir compte de cet email.</p>
                    <p>Pour tout renseignement supplémentaire, n'hésitez pas à nous contacter au <a href=\"tel:0690648904\">06 90 64 89 04</a> ou à <a href=\"mailto:tidolasab@gmail.com\">tidolasab@gmail.com</a>.</p>
                    <p>Cordialement,</p>
                    <p>Ti' Dola Sab</p>";

            // Envoi de l'e-mail
            sendEmail($to, $subject, $message);
        }
    }

} catch (Exception $e) {
    sendEmail('bastienvanderchmitt@gmail.com', 'Problème reminder tidolasab', $e->getMessage());
}