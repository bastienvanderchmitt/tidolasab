import { useLayoutContext } from "../../contexts/LayoutContext";
import React, { useEffect } from "react";
import { pages } from "../../helpers/pages";
import { useBookingContext } from "../../contexts/BookingContext";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

const Success = () => {
  const { setHeader } = useLayoutContext();
  const { checkIn, checkOut, days, total, adults, child, booked } =
    useBookingContext();

  const navigate = useNavigate();

  useEffect(() => {
    !booked ? navigate("/") : setHeader(pages.success);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Row>
        <Row className="p-4">
          <Col className="p-5">
            <Row>
              <Col>
                <h4 className="title-4 pt-4 mb-2">
                  Merci, votre réservation a bien été reçue !
                </h4>
                <span className="title-2 mt-4">
                  {/*Plus que ... jours à patentier, courage ! &#128521;*/}
                  Détail de la commande :
                </span>
              </Col>
            </Row>
            <Row className="mt-4 mb-4">
              <div className="content-detail">
                <span className="title-4">Dates :</span>
                <span className="detail">
                  du {checkIn} au {checkOut}
                </span>
              </div>
              <div className="content-detail">
                <span className="title-4">Adulte{+adults > 1 && "s"} :</span>
                <span className="detail">
                  {adults} adulte{+adults > 1 && "s"}
                </span>
              </div>
              {child ? (
                <div className="content-detail">
                  <span className="title-4">Enfant{+child > 1 && "s"} :</span>
                  <span className="detail">
                    {child} enfant{+child > 1 && "s"}
                  </span>
                </div>
              ) : null}
              <div className="content-detail">
                <span className="title-4">Nuitée{+days > 1 && "s"} :</span>
                <span className="detail">
                  {days} nuit{+days > 1 && "s"}
                </span>
              </div>
              <div className="content-total">
                <span className="title-4">Total :</span>
                <span className="total">{total ? total + " €" : ""}</span>
              </div>
            </Row>
            <Row>
              <p className="pt-4">
                Voici le RIB à télécharger sur lequel vous devez effectuer un
                virement de <strong>{total / 2} €</strong>. Ce montant
                corresponds au 50% d'acompte à verser pour confirmer la
                réservation. Suite à la réception de ce virement, votre contrat
                de location vous sera envoyé sur l'adresse email que vous avez
                saisie. Le solde restant vous sera demandé 14 jours avant
                l'arrivée.
              </p>
            </Row>
            <Row>
              <p className="pt-4">
                N'hésitez pas à aller faire un tour du côté des{" "}
                <Link to={"/activities"}>activitées</Link> pour découvrir ce que
                l'île à a vous offrir.
              </p>
            </Row>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Success;
