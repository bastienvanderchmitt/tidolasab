#!/bin/sh
# Exécuté sur LWS par la CI : sh remote.sh <dossier de l'app> <sha> [binaire php]
#
# <app>/shared/.env           configuration de production (créée à la main, une fois)
# <app>/shared/storage/       logs, sessions, cache : conservés entre les releases
# <app>/shared/backups/       sauvegarde de la base avant chaque migration (10 dernières)
# <app>/releases/<sha>/       une release par déploiement
# <app>/current -> releases/<sha>   la racine web pointe sur <app>/current/public
#
# N'utilise que des commandes disponibles sur le shell restreint LWS.
set -eu

APP="$1"
SHA="$2"
PHP="${3:-php85}"
RELEASE="$APP/releases/$SHA"
SHARED="$APP/shared"

mkdir -p "$RELEASE" "$SHARED/backups" "$SHARED/storage/app/public" "$SHARED/storage/logs" \
  "$SHARED/storage/framework/cache/data" "$SHARED/storage/framework/sessions" \
  "$SHARED/storage/framework/views"

tar -xzf "$APP/incoming/release.tar.gz" -C "$RELEASE"
ln -sfn "$SHARED/.env" "$RELEASE/.env"
ln -sfn "$SHARED/storage" "$RELEASE/storage"

# Sauvegarde de la base avant migration, identifiants lus dans le .env
env_value() {
  grep "^$1=" "$SHARED/.env" | tail -n 1 | cut -d= -f2- | sed -e 's/^["'\'']//' -e 's/["'\'']$//'
}
DUMP_CONF="$SHARED/backups/.my.cnf"
umask 077
printf '[client]\nhost=%s\nport=%s\nuser=%s\npassword="%s"\n' \
  "$(env_value DB_HOST)" "$(env_value DB_PORT)" "$(env_value DB_USERNAME)" "$(env_value DB_PASSWORD)" > "$DUMP_CONF"
mariadb-dump --defaults-extra-file="$DUMP_CONF" --single-transaction "$(env_value DB_DATABASE)" \
  | gzip > "$SHARED/backups/$(date +%Y%m%d-%H%M%S)-$SHA.sql.gz"
rm -f "$DUMP_CONF"
umask 022

cd "$RELEASE"
"$PHP" artisan migrate --force
"$PHP" artisan optimize

# Bascule sans coupure
ln -sfn "$RELEASE" "$APP/current.tmp"
mv -Tf "$APP/current.tmp" "$APP/current"

# On garde les 3 dernières releases et les 10 dernières sauvegardes
cd "$APP/releases"
ls -1t | tail -n +4 | while read -r old; do rm -rf "$old"; done
cd "$SHARED/backups"
ls -1t ./*.sql.gz 2>/dev/null | tail -n +11 | while read -r old; do rm -f "$old"; done

rm -f "$APP/incoming/release.tar.gz"

echo "Release $SHA active."
