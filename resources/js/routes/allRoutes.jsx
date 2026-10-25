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
    handle: pages.home,
  },
  {
    path: "/booking",
    element: <Booking />,
    handle: pages.booking,
  },
  {
    path: "/story",
    element: <Story />,
    handle: pages.story,
  },
  {
    path: "/activities",
    element: <Activities />,
    handle: pages.activities,
  },
  {
    path: "/photos",
    element: <Photos />,
    handle: pages.photos,
  },
  {
    path: "/contact",
    element: <Contact />,
    handle: pages.contact,
  },
  {
    path: "/success",
    element: <Success />,
    handle: pages.success,
  },
  {
    path: "/privacy",
    element: <Privacy />,
    handle: pages.privacy,
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
