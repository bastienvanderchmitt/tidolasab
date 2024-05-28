import Base from "../components/layout/Base";
import Error from "../components/layout/Error";
import Contact from "../components/pages/Contact";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Booking from "../components/pages/Booking";
import Success from "../components/pages/Success";

const staticSteps = [
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
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/booking",
    element: <Booking />,
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
