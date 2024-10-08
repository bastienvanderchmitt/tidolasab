import Base from "../components/layout/Base";
import Error from "../components/layout/Error";
import Contact from "../components/pages/Contact";
import Home from "../components/pages/Home";
import Login from "../components/pages/Admin/Login";
import Booking from "../components/pages/Booking";
import Success from "../components/pages/Success";
import Story from "../components/pages/Story";
import Activities from "../components/pages/Activities";
import Photos from "../components/pages/Photos";
import Dashboard from "../components/pages/Admin/Dashboard";
import AuthenticationGuard from "../components/pages/Admin/AuthenticationGuard";
import Privacy from "../components/pages/Rules/Privacy";
import CreateUser from "../components/pages/Admin/CreateUser";
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
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin/",
    element: <AuthenticationGuard component={Dashboard} />,
  },
  {
    path: "/admin/user/create",
    element: <AuthenticationGuard component={CreateUser} />,
  },
];

export { allRoutes };
