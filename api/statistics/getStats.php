<?php

require_once('../api.php');

global $connexion;

try {
    // Récupérer le nombre total de clients
    $totalClients = $connexion->safeFetch("SELECT COUNT(*) as total FROM clients");

    // Récupérer le nombre total de réservations
    $totalReservations = $connexion->safeFetch("SELECT COUNT(*) as total FROM reservations WHERE statut <> 'annulée' AND type <> 'Fermeture'");

    // Récupérer les réservations à venir
    $nextReservations = $connexion->safeFetchAll("SELECT CONCAT(c.nom, ' ', c.prenom) as nom_client, r.* , c.id as id_client
                                                        FROM reservations r
                                                        LEFT JOIN reservations_clients rc ON r.id = rc.id_reservation
                                                        LEFT JOIN clients c ON c.id = rc.id_client
                                                        WHERE r.date_arrivee >= CURDATE() AND r.statut = 'validée'
                                                        ORDER BY date_arrivee ASC;");

    // Récupérer le montant total des paiements
    $totalPaiements = $connexion->safeFetch("SELECT SUM(montant_paiement) as total FROM paiements");

    // Récupérer le nombre de réservations par statut
    $reservationsParStatut = $connexion->safeFetchAll("SELECT statut, COUNT(*) as total FROM reservations GROUP BY statut");

    // Récupérer le nombre de réservations par type
    $reservationsParType = $connexion->safeFetchAll("SELECT type, COUNT(*) as total FROM reservations GROUP BY type");

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
        'total_paiements' => $totalPaiements->total ?? 0,
        'reservations_a_venir' => $nextReservations,
        'reservations_par_statut' => $reservationsParStatut,
        'reservations_par_type' => $reservationsParType,
        'reservations_par_annee' => getReservationsByMonths(),
        'clients_par_annee' => getClientsByMonths(),
//        'chiffre_affaires' => $chiffreAffaires,
        'pourcentage_remplissage' => round($pourcentageRemplissage, 2),
    ]];

    http_response_code(200);
} catch (Exception $e) {
    $result = ['error' => $e->getMessage()];
    http_response_code(500);
}

echo json_encode($result);

function getReservationsByMonths()
{
    global $connexion;

    $results = $connexion->safeFetchAll("SELECT
    t.type,
    IFNULL(COUNT(r.id), 0) AS nombre_reservations,
    mois.mois
FROM
    (SELECT 'AirBnb' AS type
     UNION
     SELECT 'Booking'
     UNION
     SELECT 'Classique'
     UNION
     SELECT 'Fermeture') AS t
        CROSS JOIN
    (SELECT DATE_FORMAT(DATE_ADD(MIN(r.date_arrivee), INTERVAL n MONTH), '%Y-%m') AS mois
     FROM (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
           UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
           UNION SELECT 10 UNION SELECT 11) AS numbers
              JOIN reservations r ON 1=1
     WHERE r.date_arrivee <= LAST_DAY(CURRENT_DATE)
     GROUP BY MONTH(r.date_arrivee), YEAR(r.date_arrivee)) AS mois
        LEFT JOIN
    reservations r ON t.type = r.type AND DATE_FORMAT(r.date_arrivee, '%Y-%m') = mois.mois
GROUP BY
    t.type, mois.mois
ORDER BY
    mois.mois, t.type;",[], PDO::FETCH_ASSOC);

    // Initialisation du tableau final
    $series = [
        ["name" => "AirBnb", "data" => []],
        ["name" => "Booking", "data" => []],
        ["name" => "Classique", "data" => []],
        ["name" => "Fermeture", "data" => []]
    ];

    // Liste des mois uniques pour les labels
    $mois = [];
    foreach ($results as $row) {
        if (!in_array($row['mois'], $mois)) {
            $mois[] = $row['mois'];
        }
    }

    // Remplissage des données
    foreach ($mois as $m) {
        foreach ($series as &$serie) {
            $count = 0;
            foreach ($results as $row) {
                if ($row['type'] == $serie['name'] && $row['mois'] == $m) {
                    $count = $row['nombre_reservations'];
                    break;
                }
            }
            $serie['data'][] = $count;
        }
    }
    return [
        'mois' => $mois,
        'series' => $series
    ];
}

function getClientsByMonths()
{
    global $connexion;

    $results = $connexion->safeFetchAll("SELECT
    DATE_FORMAT(date_arrivee, '%Y-%m') AS mois,
    SUM(nombre_nuits) AS total_nuits,
    SUM(adultes) AS total_adultes
FROM
    reservations
GROUP BY
    mois
ORDER BY
    mois;",[], PDO::FETCH_ASSOC);

    return [
        'mois' => array_column($results, 'mois'),
        'series' => [
            [
                'name' => 'Nuits',
                'data' => array_column($results, 'total_nuits')
            ],
            [
                'name' => 'Adultes',
                'data' => array_column($results, 'total_adultes')
            ]
        ]
    ];
}