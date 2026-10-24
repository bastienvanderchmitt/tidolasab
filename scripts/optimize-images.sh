#!/bin/sh
# Optimise les images du site (à relancer après l'ajout de nouvelles photos) :
#   - 2048 px maximum sur le grand côté (suffisant pour la galerie en plein écran)
#   - JPEG progressif qualité 82, PNG compressé au maximum
#   - suppression des métadonnées (EXIF, coordonnées GPS, profil appareil)
# Un fichier n'est remplacé que si le résultat est au moins 5 % plus léger.
#
# Usage : scripts/optimize-images.sh [dossier]   (défaut : resources/js/assets/img)
# Prérequis : ImageMagick 7 (commande « magick »)
set -eu

DIR="${1:-resources/js/assets/img}"
MAX_SIZE=2048
JPEG_QUALITY=82
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

find "$DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | while read -r file; do
  ext=$(printf '%s' "${file##*.}" | tr 'A-Z' 'a-z')
  tmp="$TMP_DIR/out.$ext"

  if [ "$ext" = "png" ]; then
    magick "$file" -auto-orient -resize "${MAX_SIZE}x${MAX_SIZE}>" -strip \
      -define png:compression-level=9 -define png:compression-filter=5 "$tmp"
  else
    magick "$file" -auto-orient -resize "${MAX_SIZE}x${MAX_SIZE}>" -strip \
      -sampling-factor 4:2:0 -interlace JPEG -quality "$JPEG_QUALITY" "$tmp"
  fi

  before=$(wc -c < "$file")
  after=$(wc -c < "$tmp")
  if [ "$after" -lt $((before * 95 / 100)) ]; then
    mv "$tmp" "$file"
    printf '%8d Ko -> %6d Ko  %s\n' $((before / 1024)) $((after / 1024)) "$file"
  fi
done

echo "Terminé. Taille du dossier : $(du -sh "$DIR" | cut -f1)"
