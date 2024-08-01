import { Badge, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import franck_isa from "../../assets/img/story/franck_isa.jpeg";

const Story = () => {
  const teamMembers = [
    // {
    //   name: "Isabelle",
    //   image:
    //     "https://demos.creative-tim.com/argon-design-system-pro-react/assets/img/theme/kareya-saleh.jpg",
    //   description:
    //     'Artist is a term applied to a person who engages in an activity deemed to be an art. An artist also may be defined unofficially as "a person should is one who expresses him- or herself through a medium". He is should a descriptive term applied to a person who engages in an activity deemed to be an art.',
    //   fields: ["Réservations", "Communication"],
    //   socials: [
    //     { icon: faFacebook, url: "https://www.facebook.com/" },
    //     { icon: faInstagram, url: "https://www.instagram.com/" },
    //   ],
    // },
    // {
    //   name: "Franck",
    //   image:
    //     "https://demos.creative-tim.com/argon-design-system-pro-react/assets/img/theme/lucy.jpg",
    //   description:
    //     'Artist is a term applied to a person who engages in an activity deemed to be an art. An artist also may be defined unofficially as "a person should is one who expresses him- or herself through a medium". He is should a descriptive term applied to a person who engages in an activity deemed to be an art.',
    //   fields: ["Entretien", "Rhum"],
    //   socials: [
    //     { icon: faFacebook, url: "https://www.facebook.com/" },
    //     { icon: faInstagram, url: "https://www.instagram.com/" },
    //   ],
    // },
  ];

  return (
    <Container className="story" style={{ paddingBottom: "100px" }}>
      <Row className="p-4 m-lg-4 story-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">Découvrez la team</h4>
          <h4 className="title-2 pt-2">Qui sommes-nous ?</h4>
          <p className="pt-3 m-auto">
            La découverte de Marie-Galante a été un véritable coup de coeur pour
            nous. Après de multiples allers et retours sur cette magnifique île
            qui nous a adopté, nous avons décidé de ne plus en repartir et de
            nous y implanter définitivement. Notre plus grand plaisir est de
            vous la partager.
          </p>
        </Col>
      </Row>

      {teamMembers.map((member, index) => (
        <Row key={index} className="w-75 py-4 m-auto">
          <Col md={5} className={index % 2 ? "order-last" : ""}>
            <div className="p-4">
              <img
                className={
                  index % 2
                    ? "rounded shadow transform-perspective-right w-100"
                    : "rounded shadow transform-perspective-left w-100"
                }
                src={member.image}
                alt={member.name}
              />
            </div>
          </Col>
          <Col md={7} className={index % 2 ? "text-end" : ""}>
            <div className="wrapper p-md-0">
              <h3 className="card-title display-3">{member.name}</h3>
              <div className="lead">{member.description}</div>
              <ul className="list-unstyled mb-0">
                {member.fields.map((field, index) => (
                  <li className="py-2" key={index}>
                    <Badge className="title-3">{field}</Badge>
                  </li>
                ))}
              </ul>
              <div className="footer">
                {member.socials.map((social, index) => (
                  <a
                    href={social.url}
                    className="btn btn-sm rounded-circle"
                    key={index}
                  >
                    <FontAwesomeIcon
                      icon={social.icon}
                      className="rounded-5"
                      size="2xl"
                      color={social.icon === faFacebook ? "blue" : "red"}
                    />
                  </a>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      ))}

      <Row className="w-75 py-4 m-auto">
        <Col>
          <div className="p-4">
            <img
              className="rounded shadow transform-perspective-left w-100"
              src={franck_isa}
              alt="franck & isabelle"
            />
          </div>
        </Col>
      </Row>
      <Row className="w-75 py-4 m-auto">
        <Col>
          <p className="title-3 d-sm-none">Franck :</p>
          <Badge className="m-2 title-3">Entretien</Badge>
          <Badge className="m-2 title-3">Rhum</Badge>
        </Col>
        <Col>
          <p className="title-3 d-sm-none mt-4">Isabelle :</p>
          <Badge className="m-2 title-3">Accueil</Badge>
          <Badge className="m-2 title-3">Réservations</Badge>
          <Badge className="m-2 title-3">Communication</Badge>
        </Col>
      </Row>
    </Container>
  );
};

export default Story;
