import Base from "../components/layout/Base";
import Error from "../components/layout/Error";
import Contact from "../components/pages/Contact";
import Home from "../components/pages/Home";
import Booking from "../components/pages/Booking";
import Success from "../components/pages/Success";
import Story from "../components/pages/Story";
import Activities from "../components/pages/Activities";
import Photos from "../components/pages/Photos";
import Privacy from "../components/pages/Rules/Privacy";
import { pages } from "../helpers/pages";

const staticSteps = [
  {
    path: "/",
    element: <Home />,
    params: pages.home,
  },
  {
    path: "/booking",
    element: <Booking />,
    params: pages.booking,
  },
  {
    path: "/story",
    element: <Story />,
    params: pages.story,
  },
  {
    path: "/activities",
    element: <Activities />,
    params: pages.activities,
  },
  {
    path: "/photos",
    element: <Photos />,
    params: pages.photos,
  },
  {
    path: "/contact",
    element: <Contact />,
    params: pages.contact,
  },
  {
    path: "/success",
    element: <Success />,
    params: pages.success,
  },
  {
    path: "/privacy",
    element: <Privacy />,
    params: pages.privacy,
  },
  // {
  //   path: "/terms-of-use",
  //   element: <Terms />,
  //   params: pages.terms,
  // },
  // {
  //   path: "/policy",
  //   element: <Politic />,
  //   params: pages.politic,
  // },
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
