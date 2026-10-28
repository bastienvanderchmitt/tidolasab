// Copies de 800 px générées par scripts/optimize-images.sh dans assets/img/small
const images = import.meta.glob("../assets/img/**/*.webp", {
  eager: true,
  import: "default",
});

const smallByUrl = new Map(
  Object.entries(images)
    .filter(([path]) => !path.includes("/img/small/"))
    .map(([path, url]) => [url, images[path.replace("/img/", "/img/small/")]])
    .filter(([, small]) => small),
);

/**
 * Copie réduite d'une photo, ou la photo elle-même si elle est déjà petite.
 * Pour les bandeaux qui défilent : un srcSet y fait changer l'image pendant le
 * défilement aimanté, ce qui interrompt la navigation.
 */
export const small = (url) => smallByUrl.get(url) ?? url;

/**
 * Attributs srcSet / sizes d'une photo : le navigateur charge la copie réduite
 * quand elle suffit à la taille affichée.
 */
export const responsive = (url, sizes) => {
  const small = smallByUrl.get(url);
  return small ? { srcSet: `${small} 800w, ${url} 2048w`, sizes } : {};
};
