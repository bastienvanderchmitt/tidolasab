import { useEffect, useRef } from "react";

// Un seul observateur pour toute la page : l'élément apparaît une fois, puis n'est plus suivi
let observer;

const observe = (node) => {
  if (!("IntersectionObserver" in window)) {
    node.setAttribute("data-revealed", "");
    return () => {};
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-revealed", "");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  observer.observe(node);
  return () => observer.unobserve(node);
};

/**
 * Fait apparaître son contenu en fondu montant quand il entre à l'écran (global.css).
 * `index` décale l'apparition des éléments d'une même rangée.
 */
const Reveal = ({ component: Component = "div", index = 0, style, ...props }) => {
  const ref = useRef(null);

  useEffect(() => observe(ref.current), []);

  return (
    <Component
      ref={ref}
      data-reveal=""
      style={{ "--reveal-index": index, ...style }}
      {...props}
    />
  );
};

export default Reveal;
