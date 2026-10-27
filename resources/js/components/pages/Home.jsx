import Reviews from "./Home/Reviews";
import Essentials from "./Home/Essentials";
import Preview from "./Home/Preview";
import Discover from "./Home/Discover";
import Accommodation from "./Home/Accommodation";

const Home = () => {
  return (
    <>
      <Preview />
      <Accommodation />
      <Discover />
      <Reviews />
      <Essentials />
    </>
  );
};

export default Home;
