import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faBed,
  faUsers,
  faBathtub,
  faSquareParking,
  faHouse,
  faWaterLadder,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const Assets = () => {
  const { t } = useTranslation();

  return (
    <ul>
      <li>
        <FontAwesomeIcon icon={faUsers} className="me-2" />
        <span>{t("assets.people")}</span>
      </li>
      <li>
        <FontAwesomeIcon icon={faWaterLadder} className="me-2" />
        <span>{t("assets.pool")}</span>
      </li>
      <li>
        <FontAwesomeIcon icon={faWind} className="me-2" />
        <span>{t("assets.clim")}</span>
      </li>
      <li>
        <FontAwesomeIcon icon={faBed} className="me-2" />
        <span>{t("assets.bed")}</span>
      </li>
      <li>
        <FontAwesomeIcon icon={faBathtub} className="me-2" />
        <span>{t("assets.bathroom")}</span>
      </li>
      <li>
        <FontAwesomeIcon icon={faHouse} className="me-2" />
        <span>{t("assets.front")}</span>
      </li>
      <li>
        <FontAwesomeIcon icon={faWifi} className="me-2" />
        <span>{t("assets.wifi")}</span>
      </li>
      <li>
        <FontAwesomeIcon icon={faSquareParking} className="me-2" />
        <span>{t("assets.parking")}</span>
      </li>
    </ul>
  );
};

export default Assets;
