// Défilement doux, sauf si le visiteur a demandé à réduire les animations
export const scrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
