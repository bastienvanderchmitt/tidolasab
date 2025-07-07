<?php

require_once('../api.php');

global $data, $connexion;

try {
    $connexion->beginTransaction();

    if ($data->id) {
        $sql = "UPDATE paiements SET id_reservation = :booking, montant_paiement = :deposit, date_paiement = :date, moyen_paiement = :moyen_paiement, note = :note  WHERE id = :id;";
        $response = $connexion->safeExecute($sql, ['id' => $data->id, 'booking' => $data->booking, 'deposit' => $data->deposit, 'date' => $data->date, 'moyen_paiement' => $data->type, 'note' => $data->note]);
    } else {
        $sql = "INSERT INTO paiements SET id_reservation = :booking, montant_paiement = :deposit, date_paiement = :date, moyen_paiement = :moyen_paiement, note = :note;";
        $response = $connexion->safeExecute($sql, ['booking' => $data->booking, 'deposit' => $data->deposit, 'date' => $data->date, 'moyen_paiement' => $data->type, 'note' => $data->note]);
    }

    $paymentId = $data->id ?: $connexion->lastInsertId();
    $connexion->commit();

    $result = ['paymentId' => $paymentId];
    http_response_code(200);

} catch (Exception $e) {

    $connexion->rollBack();

    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);