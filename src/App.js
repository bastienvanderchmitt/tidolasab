import "./assets/app.scss";
import "animate.css/animate.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "./routes/allRoutes";
import LayoutContextProvider from "./contexts/LayoutContext";

function App() {
  return (
    <LayoutContextProvider>
      <RouterProvider router={createBrowserRouter(allRoutes)} />
    </LayoutContextProvider>
  );
}

export default App;
