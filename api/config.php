<?php

require_once('Connexion.php');

$bddHost = "localhost";
$bddName = "tidolasab";
$bddUser = "admin";
$bddPass = "admin";
$bddPort = 3306;

$connexion = new Connexion($bddHost, $bddName, $bddUser, $bddPass, $bddPort);
//$connexion = new mysqli($bddHost, $bddUser, $bddPass, $bddName);
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