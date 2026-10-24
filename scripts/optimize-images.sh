#!/bin/sh
# Optimise les images du site (à relancer après l'ajout de nouvelles photos) :
#   - photos JPEG converties en WebP (qualité 80), le JPEG d'origine est supprimé :
#     pensez à importer le fichier .webp dans le code
#   - 2048 px maximum sur le grand côté (suffisant pour la galerie en plein écran)
#   - PNG (icônes, logos) compressés au maximum
#   - suppression des métadonnées (EXIF, coordonnées GPS, profil appareil)
# Les images déjà optimisées ne sont pas modifiées : le script peut être relancé.
#
# Usage : scripts/optimize-images.sh [dossier]   (défaut : resources/js/assets/img)
# Prérequis : ImageMagick 7 (commande « magick ») avec le support WebP
set -eu

DIR="${1:-resources/js/assets/img}"
MAX_SIZE=2048
WEBP_QUALITY=80
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

resize_args="-auto-orient -resize ${MAX_SIZE}x${MAX_SIZE}> -strip"

find "$DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) | while read -r file; do
  ext=$(printf '%s' "${file##*.}" | tr 'A-Z' 'a-z')

  case "$ext" in
    jpg|jpeg)
      out="${file%.*}.webp"
      # shellcheck disable=SC2086
      magick "$file" $resize_args -quality "$WEBP_QUALITY" -define webp:method=6 "$out"
      rm "$file"
      printf 'converti     %s -> %s\n' "$file" "$out"
      ;;
    webp)
      # Seules les photos trop grandes sont réencodées
      size=$(magick identify -format '%[fx:max(w,h)]' "$file")
      if [ "$size" -gt "$MAX_SIZE" ]; then
        # shellcheck disable=SC2086
        magick "$file" $resize_args -quality "$WEBP_QUALITY" -define webp:method=6 "$TMP_DIR/out.webp"
        mv "$TMP_DIR/out.webp" "$file"
        printf 'redimensionné %s\n' "$file"
      fi
      ;;
    png)
      tmp="$TMP_DIR/out.png"
      # shellcheck disable=SC2086
      magick "$file" $resize_args -define png:compression-level=9 -define png:compression-filter=5 "$tmp"
      before=$(wc -c < "$file")
      after=$(wc -c < "$tmp")
      if [ "$after" -lt $((before * 95 / 100)) ]; then
        mv "$tmp" "$file"
        printf 'compressé    %s (%d Ko -> %d Ko)\n' "$file" $((before / 1024)) $((after / 1024))
      fi
      ;;
  esac
done

echo "Terminé. Taille du dossier : $(du -sh "$DIR" | cut -f1)"
