<?php

require_once('../api.php');

global $data;

try {

    // Récupérer le token reCAPTCHA
    $recaptchaToken = $data->recaptchaToken;

    // Vérifier le token reCAPTCHA
    $secretKey = '6LeV2q0qAAAAAGPkHs4x8ttLxVKvnw1WKjejPLZ8';
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$recaptchaToken");
    $responseKeys = json_decode($response, true);

    // Vérifier si la vérification a réussi
    if (intval($responseKeys["success"]) !== 1) {
        throw new Exception("La vérification reCAPTCHA a échoué. Veuillez réessayer.");
    }

    // Send email to admin
    $to = "tidolasab@gmail.com";
    $subject = $data->subject;
    $message = "<h4>Nouveau message de $data->name :</h4>
                <blockquote class='gmail_quote' style='margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;'>
                    $data->message
                </blockquote>";
    sendEmail($to, $subject, $message, false, false, $data->email);

    $result = ['success' => true];
    http_response_code(200);

} catch (Exception $e) {

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode(true);