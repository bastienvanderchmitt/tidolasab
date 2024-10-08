<?php

$env = 'DEV';
$root = $env === 'DEV' ? '/var/www/tidolasab/src/assets/pdf' : '/var/www/tidolasab.com/htdocs';
define('SALT','6454gb94z!fvez,;mwgez.iop*-fge54');

/**
 * Database access
 */
require_once('Connexion.php');

$bddHost = "localhost";
$bddName = "tidolasab";
$bddUser = "admin";
$bddPass = "admin";
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

function sendEmail($to, $subject, $message, $isRib = false, $iscontract = false, $reply = false) {

    global $smtpServer;
    global $smtpUsername;
    global $smtpPassword;
    global $smtpPort;
    global $root;

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
    $mail->isHTML();

    $body = <<<EOF
<html>
  <head>
    <style>
      .body-container {
        background-color: #b2dfdb;
        font-family: Arial, sans-serif;
        padding: 40px;
      }
      .container {
        width: 80%;
        margin: 40px auto;
        background-color: #fff;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .logo-container {
      text-align: center;
      }
      .logo {
        margin: 20px auto;
      }
    </style>
  </head>
  <body>
      <div class="body-container">
          <div class="logo-container">
            <img src="https://www.tidolasab.com/static/media/logo_final.9655083de4a46582f8d2.png" alt="Logo" class="logo">
          </div>
          <div class="container">
              $message
              <p>Pour tout renseignement supplémentaire, n'hésitez pas à nous contacter au <a href="tel:0690648904">06 90 64 89 04</a> ou à <a href="mailto:tidolasab@gmail.com">tidolasab@gmail.com</a>.</p>
              <p>Cordialement,</p>
              <p>Ti' Dola Sab</p>
          </div>
      </div>
  </body>
</html>
EOF;

    $mail->Body = $body;

    if ($reply)
        $mail->addReplyTo($reply);

    if ($isRib) {
        $mail->addAttachment("$root/rib.pdf", 'rib.pdf');
    }

    if ($iscontract) {
        $mail->addAttachment("$root/contrat_location.pdf", 'contrat_location.pdf');
    }

    // Envoi de l'email
    if (!$mail->send()) {
        throw new Exception('Erreur lors de l\'envoi de l\'email: ' . $mail->ErrorInfo);
    }
}