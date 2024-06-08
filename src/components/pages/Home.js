import Reviews from "./Home/Reviews";
import Essentials from "./Home/Essentials";
import Preview from "./Home/Preview";
import Discover from "./Home/Discover";
import Accommodation from "./Home/Accommodation";
import { useLayoutContext } from "../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../helpers/pages";

const Home = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.home);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Preview />
      <Discover />
      <Accommodation />
      <Reviews />
      <Essentials />
    </>
  );
};

export default Home;
