import React, { useEffect } from "react";
import { useBookingContext } from "../../contexts/BookingContext";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import rib from "../../assets/img/rib.pdf";
import { getDaysFromNow } from "../../helpers/dates";
import Price from "./Booking/Price";

const Success = () => {
  const { total, booked, selectedDates } =
    useBookingContext();

  const navigate = useNavigate();

  useEffect(() => {
    !booked && navigate("/");
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
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="title-2 mt-4">Détail de la commande :</span>
              </Col>
            </Row>
            <Row className="mt-4 mb-4">
              <Col style={{ maxWidth: "800px" }}>
                <Price withParticipants />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <span className="title-3 mt-4">
                  Plus que{" "}
                  <span className="gold">
                    {getDaysFromNow(selectedDates[0])}
                  </span>{" "}
                  jours à patentier, courage ! &#128521;
                </span>
              </Col>
            </Row>
            <Row className="bg-secondary my-4 rounded">
              <p className="p-4">
                Voici le RIB à télécharger sur lequel vous devez effectuer un
                virement de <span className="bold">{total / 2} €</span>. Ce
                montant corresponds au{" "}
                <span className="bold">50% d'acompte</span> à verser pour
                confirmer la réservation. Suite à la réception de ce virement,
                votre contrat de location vous sera envoyé sur l'adresse email
                que vous avez saisie. Le{" "}
                <span className="bold">solde restant</span> vous sera demandé{" "}
                <span className="bold">14 jours avant l'arrivée</span>.
              </p>
            </Row>
            <Row className="py-4">
              <object
                data={rib}
                type="application/pdf"
                width="100%"
                height="500px"
              >
                <p>
                  Unable to display PDF file. <a href={rib}>Download</a>{" "}
                  instead.
                </p>
              </object>
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
