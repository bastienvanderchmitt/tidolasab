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
import Terms from "../components/pages/Rules/Terms";
import Politic from "../components/pages/Rules/Politic";
import CreateUser from "../components/pages/Admin/CreateUser";

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
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms-of-use",
    element: <Terms />,
  },
  {
    path: "/policy",
    element: <Politic />,
  },
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
