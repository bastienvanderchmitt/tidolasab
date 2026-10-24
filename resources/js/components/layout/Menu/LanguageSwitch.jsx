import { useTranslation } from "react-i18next";

const LanguageSwitch = ({ isFixed }) => {
  const { i18n } = useTranslation();

  return (
    <div
      className={
        isFixed
          ? "rounded position-fixed language-switch isFixed"
          : "rounded position-fixed language-switch"
      }
    >
      <div
        className={
          i18n.language === "fr"
            ? "selected language-switch-btn"
            : "language-switch-btn"
        }
        onClick={() => i18n.changeLanguage("fr")}
      >
        FR
      </div>
      <div
        className={
          i18n.language === "en"
            ? "selected language-switch-btn"
            : "language-switch-btn"
        }
        onClick={() => i18n.changeLanguage("en")}
      >
        EN
      </div>
    </div>
  );
};

export default LanguageSwitch;
