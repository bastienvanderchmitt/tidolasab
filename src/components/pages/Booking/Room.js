import { Badge, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faHouse } from "@fortawesome/free-solid-svg-icons";
import air_conditioning from "../../../assets/img/icons/air_conditioning.png";
import breakfast from "../../../assets/img/icons/breakfast.png";
import coffee_machine from "../../../assets/img/icons/coffee_machine.png";
import douche from "../../../assets/img/icons/douche.png";
import electric_kettle from "../../../assets/img/icons/electric_kettle.png";
import fridge from "../../../assets/img/icons/fridge.png";
import microwave from "../../../assets/img/icons/microwave.png";
import serviette from "../../../assets/img/icons/serviette.png";
import stove from "../../../assets/img/icons/stove.png";
import toaster from "../../../assets/img/icons/toaster.png";
import toilets from "../../../assets/img/icons/toilets.png";
import wifi_signal from "../../../assets/img/icons/wifi_signal.png";
import { useTranslation } from "react-i18next";
import Assets from "../Home/Assets";

const Amenity = ({ text, icon }) => {
  return (
    <Col sm={12} md={6} className="amenity">
      <Row>
        <Col xs={1} className="me-4">
          <img src={icon} alt={text} />
        </Col>
        <Col>
          <p>{text}</p>
        </Col>
      </Row>
    </Col>
  );
};

const Room = () => {
  const { t } = useTranslation();

  const amenities = [
    { icon: wifi_signal, text: t("amenities.wifi") },
    { icon: air_conditioning, text: t("amenities.clim") },
    { icon: stove, text: t("amenities.hob") },
    { icon: microwave, text: t("amenities.micro-wave") },
    { icon: coffee_machine, text: t("amenities.coffee") },
    { icon: fridge, text: t("amenities.fridge") },
    { icon: toaster, text: t("amenities.toaster") },
    { icon: electric_kettle, text: t("amenities.kettle") },
    { icon: breakfast, text: t("amenities.dishes") },
    { icon: douche, text: t("amenities.shower") },
    { icon: toilets, text: t("amenities.wc") },
    { icon: serviette, text: t("amenities.towels") },
  ];

  return (
    <Row className="room">
      <h4 className="title-2 pt-2">Case Ti' Dola Sab</h4>
      <div className="title-4">{t("accommodation.breadcrumb")}</div>
      <Row>
        <Col className="room-content">
          <Assets />
        </Col>
      </Row>
      <Row className="pt-4 pb-4">
        <h5 className="pt-3 marcellus">
          <FontAwesomeIcon icon={faHouse} className="me-4 text-primary" />
          {t("room.accommodation")}
        </h5>
        {/*<p className="text-warning">{t("room.closed")}</p>*/}
        <p>{t("room.description_1")}</p>
        <p>
          {t("room.description_2_1")}
          <sup>2</sup>
          {t("room.description_2_2")}
        </p>
        <p>{t("room.description_3")}</p>
        <p>{t("room.description_4")}</p>
        <h5 className="pt-3 marcellus">
          <FontAwesomeIcon icon={faLocationDot} className="me-4 text-primary" />
          {t("room.access_title")}
        </h5>
        <p>{t("room.access_description")}</p>
      </Row>
      <Row>
        <h4 className="title-3 pt-4">{t("room.beaches")}</h4>
        <div className="room-list">
          <Badge>Folle Anse</Badge>
          <Badge>Anse Bambou</Badge>
          <Badge>Anse de Mays</Badge>
          <Badge>Anse Canot</Badge>
          <Badge>Vieux Fort</Badge>
          <Badge>la Feuillère et petite Anse</Badge>
          <Badge>Grand-Bourg</Badge>
        </div>
      </Row>
      <Row className="amenities">
        <h4 className="title-2 pt-5 pb-4">{t("room.equipments")}</h4>
        {amenities.map((amenity, key) => (
          <Amenity icon={amenity.icon} text={amenity.text} key={key} />
        ))}
      </Row>
    </Row>
  );
};

export default Room;
