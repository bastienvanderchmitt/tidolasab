<?php

require_once('../api.php');

global $data;

try {

        // Send email to admin
//        $to = "tidolasab@gmail.com";
        $to = "bastienvanderchmitt@gmail.com";
        $subject = $data->subject;
        $message = "<html>
                        <h4>Nouveau message de $data->name :</h4>
                        <blockquote class='gmail_quote' style='margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;'>
                            $data->message
                        </blockquote>
                    </html>";
        sendEmail($to, $subject, $message, false, $data->email);
        http_response_code(200);

} catch (Exception $e) {

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode(true);