import { Outlet, ScrollRestoration } from "react-router-dom";
import Menu from "./Menu";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import { Button } from "reactstrap";
import { useTranslation } from "react-i18next";

const Base = () => {
  const { i18n } = useTranslation();

  return (
    <>
      <ScrollRestoration />
      <Toaster containerStyle={{ height: "100% !important" }} />
      <Button
        onClick={() =>
          i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr")
        }
        className="rounded position-fixed top-50 start-0"
        style={{ zIndex: 999, display: "none" }}
      >
        {i18n.language === "fr" ? "Français" : "English"}
      </Button>
      <Menu />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Base;
