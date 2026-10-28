# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Couples de métropole** qui préparent des vacances aux Antilles. Ils découvrent le gîte de loin, le comparent aux annonces Airbnb et Booking, puis décident de réserver en direct ou non.
- **Guadeloupéens** qui viennent passer un week-end ou quelques jours sur Marie-Galante. Ils connaissent l'île et cherchent surtout un lieu sûr, confortable et dispo aux dates voulues.

Le site existe en français et en anglais. Le gîte accueille 2 personnes (lit parapluie et réhausseur disponibles).

## Product Purpose

Site du gîte Ti' Dola Sab, à Marie-Galante (Guadeloupe), avec son back-office. Il a deux rôles d'égale importance :

1. **Vitrine** : donner envie du lieu et de l'île, et rassurer sur la qualité de l'accueil.
2. **Réservation directe** : permettre de vérifier les disponibilités, voir le prix calculé par le serveur, et réserver sans passer par une plateforme.

Le succès, c'est un visiteur convaincu qui réserve sur le site, ou qui réserve ailleurs mais en ayant compris ce qui rend le lieu unique.

## Positioning

- **L'accueil d'Isabelle et Frank**, les propriétaires, installés sur l'île après en être tombés amoureux. Les avis clients citent d'abord leur gentillesse et leur disponibilité.
- **Une case indépendante toute en bois avec piscine privée** dans le jardin tropical, devant la terrasse.

## Operating Context

- Les visiteurs arrivent souvent depuis les annonces Airbnb et Booking, ou par le bouche-à-oreille.
- Arrivée sur l'île en avion (aérodrome) ou en ferry ; les propriétaires peuvent venir chercher les clients.
- Les réservations des plateformes (Airbnb, Booking) sont aussi suivies dans le back-office, avec leurs versements attendus.

## Capabilities and Constraints

- Site public : accueil, histoire, activités, photos, contact, réservation en plusieurs étapes (séjour, coordonnées avec vérification de l'email par code, récapitulatif).
- Back-office admin : réservations, clients, paiements, statistiques, utilisateurs, contrat de location.
- Règles métier dans `config/tidolasab.php` : tarifs basse et haute saison, taxe de séjour, 2 nuits minimum (plus sur certaines périodes), demi-nuit offerte par tranche de 7 nuits, acompte de 50 %, solde 14 jours avant l'arrivée. Le prix est toujours recalculé par le serveur.
- Stack : Laravel 13 + React 18 (Mantine 8) compilé par Vite, hébergement mutualisé LWS.

## Brand Commitments

- Nom : Ti' Dola Sab. Gîte classé 4 étoiles.
- Ton chaleureux, personnel, tourné vers l'authenticité de Marie-Galante et de la culture antillaise.
- Logos dans `resources/js/assets/img/` (`logo_final.png`, `logo_full.png`).

## Evidence on Hand

- Avis clients réels, tous issus de Booking (Marysella, Lara, Fabienne), dans `resources/js/locales/*Translations.json` (`reviews`).
- Photos du gîte, de l'île et de l'équipe dans `resources/js/assets/img/` (`room`, `caroussel`, `discover`, `story`, `locations`, `banners`).
- Ne pas inventer d'avis, de notes, de récompenses ni de chiffres de fréquentation.

## Product Principles

1. **Les personnes avant le produit** : l'accueil d'Isabelle et Frank est l'argument le plus fort ; il doit se sentir partout.
2. **Montrer le lieu tel qu'il est** : vraies photos, vrais avis, informations pratiques exactes (capacité, accessibilité partielle, règles de séjour).
3. **Réserver en direct doit être aussi simple et rassurant qu'une plateforme** : prix clair, disponibilités visibles, pas de surprise.
4. **Servir deux publics** : le voyageur lointain qui a besoin d'être rassuré, et le visiteur local qui veut aller vite.

## Accessibility & Inclusion

- Accessibilité partielle aux personnes à mobilité réduite (3 marches pour la terrasse, porte de salle de bain de 69 cm) : à toujours indiquer honnêtement.
