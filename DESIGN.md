---
name: Ti' Dola Sab
description: Gîte en bois avec piscine à Marie-Galante, site vitrine et réservation directe
colors:
  lagon: "#00838c"
  lagon-deep: "#00747c"
  lagon-mist: "#e1fbfc"
  lagon-pale: "#a2e3e7"
  sable: "#e3cfb4"
  sable-dore: "#b99d75"
  creme: "#fbf8f3"
  creme-tinted: "#f3ece0"
  white: "#ffffff"
  encre: "#22303a"
  ardoise: "#5d6b73"
typography:
  display:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "clamp(2.8rem, 7.5vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 1.1
  headline:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "clamp(1.9rem, 4vw, 2.9rem)"
    fontWeight: 400
    lineHeight: 1.15
  title:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 400
  body:
    fontFamily: "Jost, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "Jost, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.08rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Jost, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    letterSpacing: "0.18em"
  handwritten:
    fontFamily: "LaBelleAurore, cursive"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "32px"
  pill: "999px"
spacing:
  xs: "10px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "32px"
  section: "clamp(56px, 9vw, 112px)"
components:
  button-primary:
    backgroundColor: "{colors.lagon}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.lagon-deep}"
    textColor: "{colors.white}"
  button-white:
    backgroundColor: "{colors.white}"
    textColor: "{colors.lagon}"
    rounded: "{rounded.xl}"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.encre}"
    rounded: "{rounded.lg}"
    padding: "28px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.encre}"
    rounded: "{rounded.md}"
    height: "42px"
  chip:
    backgroundColor: "{colors.lagon-mist}"
    textColor: "{colors.lagon-deep}"
    rounded: "{rounded.xl}"
  booking-bar:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "14px 14px 14px 28px"
  nav-link:
    textColor: "{colors.encre}"
    typography: "{typography.body}"
  dot:
    backgroundColor: "{colors.lagon-pale}"
    rounded: "{rounded.pill}"
    width: "9px"
    height: "9px"
  dot-active:
    backgroundColor: "{colors.lagon}"
    width: "24px"
---

# Design System: Ti' Dola Sab

## Overview

**Creative North Star: "Lagon et sable"**

Le site doit donner l'impression qu'on a les pieds dans l'eau au bord de l'Anse Canot : clair, apaisé, aéré. Une base crème chaude, des touches de turquoise du lagon pour ce qui se clique, du sable doré pour les petits détails précieux (étoiles, soulignés, sur-titres du pied de page). Rien ne crie, tout respire : de grands espaces entre les sections, des photos généreuses qui portent l'émotion, du texte court.

La personnalité vient de trois voix typographiques : un serif d'inspiration antique (Marcellus) pour les titres, un sans-serif géométrique doux (Jost) pour le texte, et une écriture manuscrite (La Belle Aurore) pour les accroches personnelles, comme un mot laissé par les propriétaires. Les formes sont rondes et accueillantes, les ombres longues et diffuses.

Ce qu'on refuse : le cliché tropical criard. Pas de couleurs saturées, pas de motifs de palmiers en papier peint, pas de polices fantaisie. Le tropique vient des photos, pas de la décoration.

**Key Characteristics:**
- Base crème chaude, jamais de blanc pur en fond de page
- Turquoise réservé à l'action et à la navigation
- Sable doré en accent rare
- Trois voix typographiques aux rôles stricts
- Coins arrondis partout, boutons en pilule
- Une seule ombre, longue et diffuse
- Photos réelles du gîte et de l'île, grandes et arrondies

## Colors

Une palette lumineuse et naturelle : l'eau, le sable et l'encre.

### Primary
- **Turquoise lagon** (`lagon`): boutons principaux, liens d'action, badges, points de pagination actifs. C'est la couleur de ce qui se clique. Rampe complète `lagon` 0 à 9 dans `resources/js/theme.js` (couleur principale Mantine, nuance 7).
- **Lagon profond** (`lagon-deep`): survol des boutons, sur-titres en capitales (`.eyebrow`), légendes manuscrites, icônes des services.
- **Brume de lagon** (`lagon-mist`): fond des pastilles d'icônes et des badges clairs.
- **Lagon pâle** (`lagon-pale`): points de pagination inactifs.

### Secondary
- **Sable** (`sable`): souligné animé de la navigation, étoiles du hero, sur-titres du pied de page sur fond encre.
- **Sable doré** (`sable-dore`): étoiles des avis, icône de citation. Rampe `sable` 0 à 9 dans le thème.

### Neutral
- **Crème** (`creme`): fond de page (`--tds-cream`).
- **Crème teintée** (`creme-tinted`): bas du dégradé des sections teintées (`.tinted`, crème vers crème teintée).
- **Blanc** (`white`): cartes, barre de réservation, section du gîte (`.highlighted`) qui se détache des sections crème.
- **Encre** (`encre`): texte principal, fond du pied de page, couleur « black » de Mantine (`--tds-ink`).
- **Ardoise** (`ardoise`): texte secondaire, descriptions, libellés de champs (`--tds-muted`). Elle remplace aussi le gris « dimmed » et le texte indicatif des champs de Mantine (`cssVariablesResolver` dans `theme.js`).

### Named Rules
**The Lagoon Means Action Rule.** Le turquoise signale ce qui se clique ou ce qui est actif. Il ne sert pas de fond de section ni de décoration.

**The Sand Is Rare Rule.** Le sable n'apparaît qu'en petites touches (étoiles, soulignés, sur-titres sur fond sombre). Jamais en grande surface, jamais pour un texte courant sur fond clair.

## Typography

**Display Font:** Marcellus (avec Georgia, serif)
**Body Font:** Jost (avec -apple-system, Segoe UI, sans-serif)
**Accent Font:** La Belle Aurore (cursive)

**Character:** Marcellus apporte une élégance calme, gravée, sans luxe ostentatoire ; Jost reste lisible et doux. La Belle Aurore est la voix humaine des propriétaires.

### Hierarchy
- **Display** (400, `clamp(2.8rem, 7.5vw, 5.4rem)`, 1.1): titre du grand hero de l'accueil, en blanc sur photo avec une ombre portée légère. Les heros des autres pages utilisent `clamp(2.4rem, 6vw, 4rem)`.
- **Headline** (400, `clamp(1.9rem, 4vw, 2.9rem)`, 1.15): titres de section (`SectionTitle`).
- **Title** (400, 2rem): titres de cartes et de blocs (« Case Ti' Dola Sab »).
- **Body** (400, 1rem, 1.6): texte courant.
- **Lead** (400, 1.08rem, 1.75, ardoise): paragraphes d'introduction sous les titres de section, 760px de large au plus quand ils sont centrés.
- **Label** (400, 0.8rem, 0.18em, capitales): sur-titres au-dessus des titres de section, en lagon profond. Les libellés de la barre de réservation suivent la même logique en plus petit (0.72rem, 0.14em, ardoise).
- **Handwritten** (400, 1.5 à 2.1rem): accroches, légendes de photos, titres de témoignages.

### Named Rules
**The Three Voices Rule.** Marcellus pour les titres, Jost pour tout le reste, La Belle Aurore pour une phrase personnelle par bloc au plus. Jamais de manuscrit pour un texte informatif (prix, règles, formulaires).

**The Uppercase Is A Whisper Rule.** Les capitales sont réservées aux petits sur-titres très espacés. Pas de titre ni de bouton en capitales.

## Layout

- **Conteneur** : 1140px (`Container size="lg"` de Mantine) avec 16px de marge latérale. L'en-tête va jusqu'à 1280px avec 24px de marge.
- **Rythme vertical** : chaque section a un padding de `clamp(56px, 9vw, 112px)` (`.section`). Les blocs à l'intérieur d'une section sont espacés de 56 à 72px.
- **Grilles** : colonnes `SimpleGrid` de Mantine ; souvent deux colonnes (photo et texte) en desktop, une seule en dessous de 62em. Section services sur 5 colonnes (photos sur 2, liste sur 3).
- **Points de rupture** : ceux de Mantine, surtout `48em` (mobile) et `62em` (tablette).
- **Alternance des fonds** : les sections alternent crème, blanc (`.highlighted`) et dégradé teinté (`.tinted`) pour séparer les blocs sans traits.
- **Hero** : photo plein cadre (100svh moins 72px sur l'accueil, 52vh ailleurs), dégradé sombre en haut et en bas pour la lisibilité, la barre de réservation chevauche le bas du hero de 56px.

## Elevation & Depth

Le système est presque plat : la profondeur vient surtout de l'alternance des fonds et des photos. Une seule ombre principale, très longue et très diffuse, soulève les éléments qui flottent : cartes d'avis, barre de réservation, sliders, boutons ronds sur les photos.

### Shadow Vocabulary
- **Ombre flottante** (`box-shadow: 0 18px 50px -20px rgba(34, 48, 58, 0.28)`, `--tds-shadow`): cartes, barre de réservation, sliders, flèches de navigation.
- **Ombre d'en-tête** (`box-shadow: 0 6px 24px -12px rgba(34, 48, 58, 0.25)`): en-tête devenu opaque au défilement, avec un fond crème translucide et un flou de 12px.

### Named Rules
**The One Shadow Rule.** Une seule ombre pour tout ce qui flotte, toujours teintée de l'encre, jamais grise ni noire. Pas d'empilement d'ombres.

## Shapes

Des formes douces et accueillantes. Les photos et les cartes ont des coins de 16px (`radius lg`), les champs 8px (`radius md`), les boutons et la barre de réservation sont en pilule. Les pastilles d'icônes sont des cercles de 44px. Aucun trait de bordure décoratif : les séparations se font par l'espace ou par un filet gris très clair (`gray-2`) dans la barre de réservation.

### Named Rules
**The No Sharp Corner Rule.** Rien d'anguleux sur le site public : une photo, une carte ou un bouton a toujours ses coins arrondis.

## Components

### Buttons
Doux et engageants.
- **Shape:** pilule (`radius xl`, 32px) par défaut sur tous les boutons Mantine.
- **Primary:** fond lagon, texte blanc, icône à gauche quand l'action le justifie (calendrier pour « Réserver »). Taille `md` pour les appels à l'action.
- **Hover / Focus:** passage au lagon profond, effet d'appui de Mantine.
- **White:** bouton rond blanc avec icône lagon et ombre flottante, pour les flèches posées sur les photos. Masqué en début et fin de course plutôt que grisé.

### Chips
- **Style:** badges Mantine `light` couleur lagon, en pilule, texte sans capitales (noms de plages, équipements).

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** blanc (avis : blanc à 94 % sur photo assombrie).
- **Shadow Strategy:** ombre flottante, ou aucune sur fond blanc.
- **Border:** aucune.
- **Internal Padding:** 28px.

### Inputs / Fields
- **Style:** champs Mantine taille `md`, coins de 8px, fond blanc.
- **Focus:** contour lagon de Mantine.
- **Error:** message rouge de Mantine sous le champ, formulé en phrase complète.

### Navigation
- **Style:** en-tête fixe, transparent et texte blanc sur le hero, puis crème translucide avec flou et texte encre au défilement. Liens en Jost 1rem, espacement 0.04em, opacité 0.88.
- **Hover / Active:** opacité pleine et souligné sable de 2px qui se déploie depuis le centre.
- **Mobile:** tiroir avec les liens en Marcellus 1.6rem.

### Photo Slider
Signature du site : les photos réelles portent l'émotion.
- **Bandeau (accueil) :** largeur du conteneur, trois photos 4:5 visibles en desktop, deux en tablette, une et le début de la suivante sur mobile. Défilement natif aimanté, flèches blanches rondes, navigation au clavier.
- **Une photo (gîte) :** photo 4:3 arrondie avec ombre flottante, légende manuscrite blanche en bas à gauche.
- **Pagination :** sous la photo, points lagon pâle de 9px ; le point actif s'allonge à 24px en lagon.

### Booking Bar
Barre de réservation rapide en pilule blanche, qui chevauche le bas du hero : champs séjour, voyageurs et prix séparés par des filets fins, libellés en petites capitales ardoise, bouton lagon de 56px de haut. Sur mobile, elle devient une carte de 16px de rayon, les champs empilés.

## Do's and Don'ts

### Do:
- **Do** garder le fond de page en crème (`--tds-cream`) et réserver le blanc aux cartes et aux sections à détacher.
- **Do** utiliser l'ombre flottante (`--tds-shadow`) pour tout élément qui flotte, et rien d'autre.
- **Do** mettre un sur-titre en petites capitales lagon profond au-dessus des titres de section, avec `SectionTitle`.
- **Do** utiliser les vraies photos du gîte et de l'île en grand, coins de 16px.
- **Do** placer la pagination des sliders sous les photos, en points lagon.
- **Do** respecter `prefers-reduced-motion` pour toute animation d'entrée, le défilement doux (`helpers/motion.js`) et les zooms au survol.
- **Do** servir les photos avec `responsive()` (`helpers/responsiveImage.js`) et un `sizes` qui décrit leur largeur affichée.
- **Do** donner aux points de pagination une zone cliquable de 24px autour du point visible de 9px.

### Don't:
- **Don't** tomber dans le cliché tropical criard : pas de couleurs saturées, pas de motifs de palmiers répétés, pas de police fantaisie.
- **Don't** utiliser le turquoise en grand fond de section ni le sable pour du texte courant sur fond clair.
- **Don't** utiliser l'écriture manuscrite pour un prix, une règle ou un formulaire.
- **Don't** faire des coins droits ni des bordures décoratives.
- **Don't** descendre sous la nuance 7 de la rampe lagon pour un texte ou un fond de texte blanc : les nuances 7 à 9 ont été foncées pour atteindre 4.5:1 (blanc sur lagon 4.5:1, lagon profond sur crème 5.2:1), au plus clair possible pour garder un turquoise vif. Les nuances 0 à 6 servent aux fonds, points et pastilles.
- **Don't** utiliser le gris de Mantine (`gray.5`, `gray.6`) pour du texte : prendre l'ardoise.
