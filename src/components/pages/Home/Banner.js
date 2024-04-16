import crick from "../../../assets/img/crick.jpg";
import { Parallax } from "react-parallax";

const Banner = () => {
  return (
    <>
      <Parallax
        blur={2}
        bgImage={crick}
        bgImageAlt="the cat"
        strength={200}
        className="text-white text-center p-5"
      >
        <h4 className="marcellus">BIENVENUE À MARIE-GALANTE</h4>
        <h2 className="marcellus">
          Partez à la découverte de l’île en toute liberté
        </h2>
        <div className="mt-4 jost">
          <p>Paysages, nature, culture il y a tant de choses à découvrir.</p>
          <p>
            Partez en randonnée, visitez un site historique, découvrez les
            saveurs locales, prélassez vous sur la plage…
          </p>
          <p>
            Suivez votre rythme et laissez vous porter par la douce chaleur des
            Caraïbes.
          </p>
        </div>
      </Parallax>
    </>
  );
};

export default Banner;
