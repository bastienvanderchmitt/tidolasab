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
import AuthenticationGuard from "../components/pages/Admin/AuthenticationGuard";
import Privacy from "../components/pages/Rules/Privacy";
import CreateUser from "../components/pages/Admin/CreateUser";
import { pages } from "../helpers/pages";
import PrivateRoutes from "../components/pages/Admin/PrivateRoutes";
import Bookings from "../components/pages/Admin/Bookings";
import Clients from "../components/pages/Admin/Clients";
import Payments from "../components/pages/Admin/Payments";
import Statistics from "../components/pages/Admin/Statistics";
import Client from "../components/pages/Admin/Client";
import { Navigate } from "react-router-dom";
import {
  faChartSimple,
  faEuroSign,
  faFileLines,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Dashboard from "../components/pages/Admin/Dashboard";

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

const adminRoutes = [
  {
    path: "/admin/",
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
    label: "Dashboard",
  },
  {
    path: "/admin/bookings",
    element: <Bookings />,
    icon: faFileLines,
    label: "Réservations",
  },
  {
    path: "/admin/clients",
    element: <Clients />,
    icon: faUser,
    label: "Clients",
  },
  {
    path: "/admin/payments",
    element: <Payments />,
    icon: faEuroSign,
    label: "Paiements",
  },
  // {
  //   path: "/admin/statistics",
  //   element: <Statistics />,
  //   icon: faChartSimple,
  //   label: "Statistiques",
  // },
  {
    path: "/admin/client/:id",
    element: <Client />,
    label: "Détail client",
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
    errorElement: <Error />,
    element: <Login />,
  },
  {
    element: <PrivateRoutes />,
    errorElement: <Error />,
    children: adminRoutes,
  },
  {
    path: "/admin/user/create",
    errorElement: <Error />,
    element: <AuthenticationGuard component={CreateUser} />,
  },
];

export { allRoutes, adminRoutes };
