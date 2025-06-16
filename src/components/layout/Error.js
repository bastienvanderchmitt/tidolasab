import { Link, useRouteError } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { useEffect } from "react";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  useEffect(() => {
    const text = document.querySelector(".glitch-text");
    if (text) {
      const createGlitch = () => {
        const glitchText = text.innerText;
        text.setAttribute("data-text", glitchText);
      };
      createGlitch();
    }
  }, []);

  return (
    <div className="error-page">
      <div className="palm-leaves"></div>
      <Container fluid>
        <Row>
          <Col className="error-content">
            <div className="glitch-wrapper">
              <h1 className="glitch-text">404</h1>
            </div>
            <p className="error-description">
              Oups ! Cette page s'est envolée vers les Caraïbes
            </p>
            <Link to="/" className="error-button">
              Retour à l'accueil
              <span className="button-arrow">→</span>
            </Link>
          </Col>
        </Row>
      </Container>
      <style>
        {`
            .error-page {
              min-height: 100vh;
              background: linear-gradient(135deg, #f5f5f5 0%, #e0f4f5 100%);
              color: #2C3E50;
              display: flex;
              align-items: center;
              position: relative;
              overflow: hidden;
            }

            .palm-leaves {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: radial-gradient(circle at 10% 20%, rgba(14, 161, 171, 0.05) 0%, transparent 50%),
                              radial-gradient(circle at 90% 80%, rgba(14, 161, 171, 0.05) 0%, transparent 50%);
              z-index: 1;
              animation: sway 15s ease-in-out infinite;
            }

            .palm-leaves::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50 L30 30 M50 50 L70 30 M50 50 L30 70 M50 50 L70 70' stroke='rgba(14, 161, 171, 0.05)' stroke-width='1'/%3E%3C/svg%3E");
              animation: rotate 240s linear infinite;
            }

            .error-content {
              text-align: center;
              padding: 2rem;
              position: relative;
              z-index: 2;
            }

            .glitch-wrapper {
              margin-bottom: 2rem;
            }

            .glitch-text {
              font-size: 12rem;
              font-weight: 800;
              position: relative;
              text-shadow: 0.05em 0 0 rgb(14, 161, 171), -0.03em -0.04em 0 #4ECDC4,
                          0.025em 0.04em 0 #FFD93D;
              animation: glitch 725ms infinite;
              background: linear-gradient(45deg, rgb(14, 161, 171), #4ECDC4, #FFD93D);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }

            .glitch-text::before,
            .glitch-text::after {
              content: attr(data-text);
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }

            .glitch-text::before {
              left: 2px;
              text-shadow: -2px 0 rgb(14, 161, 171);
              clip: rect(44px, 450px, 56px, 0);
              animation: glitch-anim 5s infinite linear alternate-reverse;
            }

            .glitch-text::after {
              left: -2px;
              text-shadow: -2px 0 #4ECDC4, 2px 2px #FFD93D;
              animation: glitch-anim2 1s infinite linear alternate-reverse;
            }

            .error-description {
              font-size: 1.5rem;
              margin-bottom: 2rem;
              color: #2C3E50;
              font-weight: 300;
              text-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }

            .error-button {
              display: inline-flex;
              align-items: center;
              padding: 1rem 2rem;
              font-size: 1.1rem;
              color: #ffffff;
              background: linear-gradient(45deg, rgb(14, 161, 171), #4ECDC4);
              border: none;
              border-radius: 50px;
              text-decoration: none;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(14, 161, 171, 0.2);
            }

            .error-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(14, 161, 171, 0.3);
              background: linear-gradient(45deg, #4ECDC4, rgb(14, 161, 171));
            }

            .button-arrow {
              margin-left: 0.5rem;
              transition: transform 0.3s ease;
            }

            .error-button:hover .button-arrow {
              transform: translateX(5px);
            }

            @keyframes sway {
              0%, 100% { transform: rotate(-1deg); }
              50% { transform: rotate(1deg); }
            }

            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            @keyframes glitch {
              0% {
                text-shadow: 0.05em 0 0 rgb(14, 161, 171), -0.03em -0.04em 0 #4ECDC4,
                            0.025em 0.04em 0 #FFD93D;
              }
              15% {
                text-shadow: 0.05em 0 0 rgb(14, 161, 171), -0.03em -0.04em 0 #4ECDC4,
                            0.025em 0.04em 0 #FFD93D;
              }
              16% {
                text-shadow: -0.05em -0.025em 0 rgb(14, 161, 171), 0.025em 0.035em 0 #4ECDC4,
                            -0.05em -0.05em 0 #FFD93D;
              }
              49% {
                text-shadow: -0.05em -0.025em 0 rgb(14, 161, 171), 0.025em 0.035em 0 #4ECDC4,
                            -0.05em -0.05em 0 #FFD93D;
              }
              50% {
                text-shadow: 0.05em 0.035em 0 rgb(14, 161, 171), 0.03em 0 0 #4ECDC4,
                            0 -0.04em 0 #FFD93D;
              }
              99% {
                text-shadow: 0.05em 0.035em 0 rgb(14, 161, 171), 0.03em 0 0 #4ECDC4,
                            0 -0.04em 0 #FFD93D;
              }
              100% {
                text-shadow: -0.05em 0 0 rgb(14, 161, 171), -0.025em -0.04em 0 #4ECDC4,
                            -0.04em -0.025em 0 #FFD93D;
              }
            }

            @media (max-width: 768px) {
              .glitch-text {
                font-size: 8rem;
              }
              .error-description {
                font-size: 1.2rem;
              }
            }
          `}
      </style>
    </div>
  );
};

export default Error;
