import "./assets/app.scss";
import "animate.css/animate.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "./routes/allRoutes";
import LayoutContextProvider from "./contexts/LayoutContext";
import BookingContextProvider from "./contexts/BookingContext";

function App() {
  return (
    <LayoutContextProvider>
      <BookingContextProvider>
        <RouterProvider router={createBrowserRouter(allRoutes)} />
      </BookingContextProvider>
    </LayoutContextProvider>
  );
}

export default App;
