import { useLayoutContext } from "../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../helpers/pages";
import { Badge, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Story = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.story);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const teamMembers = [
    {
      name: "Isabelle",
      image:
        "https://demos.creative-tim.com/argon-design-system-pro-react/assets/img/theme/kareya-saleh.jpg",
      description:
        'Artist is a term applied to a person who engages in an activity deemed to be an art. An artist also may be defined unofficially as "a person should is one who expresses him- or herself through a medium". He is should a descriptive term applied to a person who engages in an activity deemed to be an art.',
      fields: ["Réservations", "Communication"],
      socials: [
        { icon: faFacebook, url: "https://www.facebook.com/" },
        { icon: faInstagram, url: "https://www.instagram.com/" },
      ],
    },
    {
      name: "Franck",
      image:
        "https://demos.creative-tim.com/argon-design-system-pro-react/assets/img/theme/lucy.jpg",
      description:
        'Artist is a term applied to a person who engages in an activity deemed to be an art. An artist also may be defined unofficially as "a person should is one who expresses him- or herself through a medium". He is should a descriptive term applied to a person who engages in an activity deemed to be an art.',
      fields: ["Entretien", "Rhum"],
      socials: [
        { icon: faFacebook, url: "https://www.facebook.com/" },
        { icon: faInstagram, url: "https://www.instagram.com/" },
      ],
    },
  ];

  return (
    <Container className="story" style={{ paddingBottom: "100px" }}>
      <Row className="p-4 m-lg-4 story-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">Découvrez la team</h4>
          <h4 className="title-2 pt-2">Qui-sommes nous ?</h4>
          <p className="pt-3 m-auto">
            AD Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ex
            orci, facilisis sit amet vulputate posuere, vulputate imperdiet
            ligula. Cras faucibus felis nec tempor vestibulum. Nullam erat
            felis, lacinia a hendrerit ut, pellentesque vitae ipsum. Fusce porta
            gravida erat vitae tristique. Donec vel massa finibus, fermentum
            tellus vel, cursus sapien. Curabitur efficitur condimentum ultrices.
            Vestibulum pellentesque commodo ex. Donec blandit odio dui, at
            dapibus tellus efficitur at. Nunc id dui maximus, blandit tellus et,
            iaculis nisl.
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
    </Container>
  );
};

export default Story;
