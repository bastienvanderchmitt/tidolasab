#!/bin/sh
# Incruste « © Tidolasab » en bas à droite des photos du site (à relancer après
# l'ajout de nouvelles photos, après scripts/optimize-images.sh).
#   - seules les photos WebP sont concernées : icônes, logos (PNG) et bannières
#     (affichées en fond recadré, le texte serait coupé) sont ignorés
#   - les photos déjà marquées sont listées dans scripts/watermarked.txt et ne sont
#     pas modifiées une seconde fois : le script peut être relancé
#
# Usage : scripts/watermark-images.sh [dossier]   (défaut : resources/js/assets/img)
# Prérequis : ImageMagick 7 (commande « magick ») avec le support WebP, police Noto Sans
set -eu

DIR="${1:-resources/js/assets/img}"
TEXT="© Tidolasab"
FONT="${WATERMARK_FONT:-/usr/share/fonts/noto/NotoSans-Bold.ttf}"
WEBP_QUALITY=80
DONE_LIST="$(dirname "$0")/watermarked.txt"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

touch "$DONE_LIST"

find "$DIR" -type f -iname '*.webp' -not -path '*/banners/*' | sort | while read -r file; do
  if grep -qxF "$file" "$DONE_LIST"; then
    continue
  fi

  # Taille du texte proportionnelle au petit côté de la photo
  size=$(magick identify -format '%[fx:int(max(14,min(w,h)*0.025))]' "$file")
  margin=$((size * 2 / 3))
  shadow=$((margin - size / 20 - 1))

  magick "$file" -gravity southeast -font "$FONT" -pointsize "$size" \
    -fill 'rgba(0,0,0,0.35)' -annotate "+${shadow}+${shadow}" "$TEXT" \
    -fill 'rgba(255,255,255,0.8)' -annotate "+${margin}+${margin}" "$TEXT" \
    -quality "$WEBP_QUALITY" -define webp:method=6 "$TMP_DIR/out.webp"
  mv "$TMP_DIR/out.webp" "$file"
  printf '%s\n' "$file" >> "$DONE_LIST"
  printf 'marqué %s\n' "$file"
done

echo "Terminé."
