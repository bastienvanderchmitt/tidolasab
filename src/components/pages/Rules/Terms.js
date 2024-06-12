import { useLayoutContext } from "../../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../../helpers/pages";
import { Button, Col, Container, Row } from "reactstrap";

const Terms = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.terms);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container className="py-5">
      <Row>
        <Col xs="12" md="8" className="mx-auto p-4">
          <p>
            Le site de location de gîte <b>tidolasab</b> est engagé à protéger
            la confidentialité des informations personnelles de ses
            utilisateurs. Cette page décrit les règles de confidentialité que
            nous appliquons pour collecter, utiliser et protéger vos
            informations personnelles.
          </p>
          <h3>Collecte des informations personnelles</h3>
          <p>
            Lorsque vous utilisez notre site, nous pouvons collecter les
            informations suivantes :
          </p>
          <ul>
            <li>Votre nom et prénom</li>
            <li>Votre adresse e-mail</li>
            <li>Votre adresse postale</li>
            <li>Votre numéro de téléphone</li>
          </ul>
          <h3>Utilisation des informations personnelles</h3>
          <p>
            Nous utilisons les informations personnelles collectées pour les
            finalités suivantes :
          </p>
          <ul>
            <li>Gérer vos réservations et vos paiements</li>
            <li>
              Vous envoyer des informations sur vos réservations et des mises à
              jour sur notre site
            </li>
            <li>Vous proposer des offres et des promotions personnalisées</li>
          </ul>
          <h3>Sécurité des informations personnelles</h3>
          <p>
            Nous prenons des mesures de sécurité appropriées pour protéger les
            informations personnelles collectées contre la perte, la vol,
            l'utilisation abusive, la divulgation non autorisée, la modification
            ou la destruction.
          </p>
          <h3>Partage des informations personnelles</h3>
          <p>
            Nous ne partageons pas vos informations personnelles avec des tiers,
            sauf si cela est nécessaire pour gérer vos réservations ou si nous
            sommes légalement tenus de le faire.
          </p>
          <h3>Droits des utilisateurs</h3>
          <p>Vous avez le droit de :</p>
          <ul>
            <li>Accéder à vos informations personnelles</li>
            <li>
              Demander la rectification ou la suppression de vos informations
              personnelles
            </li>
            <li>
              S'opposer à l'utilisation de vos informations personnelles à des
              fins commerciales
            </li>
          </ul>
          <p>
            Pour exercer ces droits, veuillez nous contacter à l'adresse{" "}
            <a href="mailto:tidolasab@gmail.com">tidolasab@gmail.com</a>.
          </p>
          <Button color="primary" href="/contact">
            Contactez-nous
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Terms;
