import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import * as Sentry from "@sentry/react";
import beach from "../../assets/img/banners/dolasab_beach.webp";
import logo from "../../assets/img/logo_final.png";
import classes from "./Error.module.css";

/**
 * Page introuvable ou erreur de rendu : une plage calme et un chemin vers l'accueil.
 */
const Error = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  // Le routeur intercepte les erreurs de rendu : on les remonte nous-mêmes
  useEffect(() => {
    if (error && !isNotFound) Sentry.captureException(error);
  }, [error, isNotFound]);

  return (
    <main className={classes.page} style={{ backgroundImage: `url(${beach})` }}>
      <Link to="/" className={classes.brand}>
        <img src={logo} alt="" width={44} height={44} />
        <span>Ti' Dola Sab</span>
      </Link>
      <div className={classes.content}>
        <h1 className={classes.title}>{isNotFound ? "404" : t("error.title")}</h1>
        <p className={`${classes.description} handwritten`}>
          {t(isNotFound ? "error.not_found" : "error.unexpected")}
        </p>
        <Button
          component={Link}
          to="/"
          size="md"
          variant="white"
          leftSection={<IconArrowLeft size={18} />}
        >
          {t("error.home")}
        </Button>
      </div>
    </main>
  );
};

export default Error;
