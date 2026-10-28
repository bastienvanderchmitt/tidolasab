<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Ti' Dola Sab - Réservation de gîte à Marie-Galante"
    />
    <link rel="manifest" href="/manifest.json" />
    <title>Ti' Dola Sab</title>
    @if (request()->is('/'))
      {{-- Bannière de l'accueil, la plus grande image affichée au chargement --}}
      <link rel="preload" as="image" href="{{ Vite::asset('resources/js/assets/img/banners/home_banner.webp') }}" fetchpriority="high" />
    @endif
    @viteReactRefresh
    @vite('resources/js/index.jsx')
  </head>
  <body>
    <noscript>Vous devez activer JavaScript pour utiliser ce site.</noscript>
    <div id="root"></div>
  </body>
</html>
