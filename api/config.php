<?php

/**
 * Database access
 */
require_once('Connexion.php');

$bddHost = "185.98.131.176";
$bddName = "tidol2380910";
$bddUser = "tidol2380910";
$bddPass = "x5awliixto";
$bddPort = 3306;

$connexion = new Connexion($bddHost, $bddName, $bddUser, $bddPass, $bddPort);


/**
 * API config
 */
$data = clearInput(json_decode(file_get_contents("php://input")));


function clearInput($input)
{
    if (!$input) return $input;
    if (is_array($input)) {
        $result = array();

        foreach ($input as $index => $value)
            $result[$index] = clearInput($value);

    } else if (is_object($input)) {
        $result = new stdClass();

        foreach ($input as $key => $value)
            $result->$key = clearInput($value);

    } else {
        $result = htmlspecialchars($input, ENT_HTML5, 'UTF-8');
    }

    return $result;
}


/**
 * Email config
 */
require_once __DIR__.'/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

// Configuration du serveur SMTP
$smtpServer = 'smtp.gmail.com';
$smtpUsername = 'bastienvanderchmitt@gmail.com';
$smtpPassword = 'waqo kjki nlpu ovjk';
$smtpPort = 587;

function sendEmail($to, $subject, $message, $isRib = false, $reply = false) {

    global $smtpServer;
    global $smtpUsername;
    global $smtpPassword;
    global $smtpPort;

    // Création de l'objet PHPMailer
    $mail = new PHPMailer();

    // Configuration de l'email
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->Host = $smtpServer;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->Port = $smtpPort;
    $mail->setFrom('tidolasab@gmail.com', 'Tidolasab');
    $mail->addAddress($to);
    $mail->Subject = $subject;
    $mail->Body = $message;
    $mail->isHTML();

    if ($reply)
        $mail->addReplyTo($reply);

    if ($isRib) {
        // Ajout du RIB comme pièce jointe
        $mail->addAttachment('/var/www/tidolasab/src/assets/img/rib.pdf', 'rib.pdf');
    }

    // Envoi de l'email
    if (!$mail->send()) {
        throw new Exception('Erreur lors de l\'envoi de l\'email: ' . $mail->ErrorInfo);
    }
}