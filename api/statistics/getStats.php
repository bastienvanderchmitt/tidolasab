<?php

require_once('../api.php');

global $connexion;

try {
    // Récupérer le nombre total de clients
    $totalClients = $connexion->safeFetch("SELECT COUNT(*) as total FROM clients");

    // Récupérer le nombre total de réservations
    $totalReservations = $connexion->safeFetch("SELECT COUNT(*) as total FROM reservations WHERE date_arrivee >= CURDATE() AND statut = 'validée'");

    // Récupérer le montant total des paiements
    $totalPaiements = $connexion->safeFetch("SELECT SUM(montant_paiement) as total FROM paiements");

    // Récupérer le nombre de réservations par statut
    $reservationsParStatut = $connexion->safeFetchAll("SELECT statut, COUNT(*) as total FROM reservations GROUP BY statut");

    // Taux remplissage
    $dateDebut = new DateTime();
    $dateFin = new DateTime();
    $dateFin->modify('+6 months');

    $joursDisponibles = 0;
    while ($dateDebut < $dateFin) {
        $joursDisponibles += cal_days_in_month(CAL_GREGORIAN, $dateDebut->format('n'), $dateDebut->format('Y'));
        $dateDebut->modify('+1 month');
    }

    $reservations = $connexion->safeFetchAll("
        SELECT SUM(DATEDIFF(date_depart, date_arrivee)) AS jours_reserves
        FROM reservations
        WHERE date_arrivee < DATE_ADD(CURDATE(), INTERVAL 6 MONTH)
        AND date_depart > CURDATE()
    ",[], PDO::FETCH_ASSOC);

    $joursReserves = $reservations[0]['jours_reserves'] ?? 0;
    $pourcentageRemplissage = ($joursDisponibles > 0) ? ($joursReserves / $joursDisponibles) * 100 : 0;



    // Rassembler toutes les statistiques dans un tableau
    $result = ['statistics' => [
        'total_clients' => $totalClients->total,
        'total_reservations' => $totalReservations->total,
        'total_paiements' => $totalPaiements->total ?? 0, // Si aucun paiement, mettre 0
        'reservations_par_statut' => $reservationsParStatut,
        'chiffre_affaires' => $chiffreAffaires,
        'pourcentage_remplissage' => round($pourcentageRemplissage, 2),
    ]];

    http_response_code(200);
} catch (Exception $e) {
    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);