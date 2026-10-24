# Ti' Dola Sab

Site de réservation du gîte Ti' Dola Sab (Marie-Galante) et son back-office.

- **Back** : Laravel 13 (PHP 8.5, minimum 8.3), MariaDB, authentification admin par session (Sanctum)
- **Front** : React 18 compilé par Vite, servi par Laravel (`resources/js`)
- **Suivi des erreurs** : Sentry (back et front)
- **Hébergement** : LWS (mutualisé)

## Installation locale

```sh
composer install
yarn install
cp .env.example .env   # puis renseigner DB_*, LEGACY_PASSWORD_SALT, RECAPTCHA_SECRET_KEY
php artisan key:generate
php artisan migrate
```

Lancer le site : `php artisan serve` et, dans un autre terminal, `yarn dev`.
Les emails sont écrits dans `storage/logs/laravel.log` (`MAIL_MAILER=log`).

## Tests

```sh
vendor/bin/pest   # back : utilise la base tidolasab_test (voir phpunit.xml)
yarn test         # front
```

## Règles métier

Tarifs, saisons, taxe de séjour, durées minimales et acompte sont dans
`config/tidolasab.php`. Le front lit ces règles via `GET /api/pricing`, et le prix
est toujours recalculé par le serveur (`App\Services\PricingService`).

Pour changer les tarifs d'une nouvelle année, ajouter une entrée dans `rates`.

## API

| Accès  | Route |
|--------|-------|
| Public | `GET /api/bookings/reserved`, `GET /api/pricing`, `POST /api/bookings`, `POST /api/contact`, `POST /api/login` |
| Admin  | tout le reste (`auth:sanctum`) : réservations, clients, paiements, statistiques, utilisateurs |

Les erreurs sont toujours renvoyées en JSON : `{ "message": "...", "errors": { "champ": ["..."] } }`
(422 pour une règle métier ou une validation, 401 sans session, 404, 500).

## Déploiement (LWS)

Le workflow `.github/workflows/deploy.yml` lance les tests à chaque push, puis sur `main` :
build du front et des dépendances dans la CI, envoi par SFTP, et activation par SSH
(`deploy/remote.sh` : sauvegarde de la base, migrations, cache, bascule du lien `current`).
Le script n'utilise que des commandes disponibles sur le shell restreint LWS.

À configurer une fois :

1. Sur LWS :
   - dans le panneau, passer la version PHP du site en **8.5**. En ligne de commande,
     `php` reste en 8.2 : utiliser `php85` ;
   - créer `<app>/shared/.env` (production, `APP_DEBUG=false`) ;
   - faire pointer la racine web du domaine sur `<app>/current/public`.
2. Dans GitHub (environnement `production`) :
   - secrets : `LWS_HOST`, `LWS_USER`, `LWS_SSH_KEY`, `LWS_PORT`, `VITE_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
   - variables : `LWS_APP_PATH`, `LWS_PHP` (`php85` par défaut), `SENTRY_ORG`, `SENTRY_PROJECT`
3. Cron LWS : `cd <app>/current && php85 artisan schedule:run` chaque minute,
   ou `php85 artisan reminders:send` une fois par jour (rappel du solde à J-14).

Avant chaque migration, `deploy/remote.sh` sauvegarde la base dans `<app>/shared/backups`
(10 dernières sauvegardes conservées).
