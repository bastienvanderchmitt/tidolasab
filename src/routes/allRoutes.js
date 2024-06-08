import Base from "../components/layout/Base";
import Error from "../components/layout/Error";
import Contact from "../components/pages/Contact";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Booking from "../components/pages/Booking";
import Success from "../components/pages/Success";
import Story from "../components/pages/Story";
import Activities from "../components/pages/Activities";
import Photos from "../components/pages/Photos";

const staticSteps = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/booking",
    element: <Booking />,
  },
  {
    path: "/story",
    element: <Story />,
  },
  {
    path: "/activities",
    element: <Activities />,
  },
  {
    path: "/photos",
    element: <Photos />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/success",
    element: <Success />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

const allRoutes = [
  {
    path: "/",
    element: <Base />,
    errorElement: <Error />,
    children: staticSteps,
  },
];

export { allRoutes };
