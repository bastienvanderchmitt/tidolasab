import Base from "../components/layout/Base";
import Error from "../components/layout/Error";
import Contact from "../components/pages/Contact";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Services from "../components/pages/Services";

const staticSteps = [
  {
    path: "/contact",
    element: <Contact />,
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
    path: "/services",
    element: <Services />,
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
