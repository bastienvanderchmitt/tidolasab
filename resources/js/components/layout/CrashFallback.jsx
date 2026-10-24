/**
 * Affiché par l'Error Boundary Sentry si l'application plante hors du routeur.
 */
const CrashFallback = () => (
  <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
    <h1>Oups</h1>
    <p>Une erreur inattendue est survenue, nous en avons été informés.</p>
    <a href="/">Retour à l'accueil</a>
  </div>
);

export default CrashFallback;
