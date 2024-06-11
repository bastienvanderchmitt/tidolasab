import "./assets/app.scss";
import "animate.css/animate.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "./routes/allRoutes";
import LayoutContextProvider from "./contexts/LayoutContext";
import BookingContextProvider from "./contexts/BookingContext";
import AdminContextProvider from "./contexts/AdminContext";

function App() {
  return (
    <AdminContextProvider>
      <LayoutContextProvider>
        <BookingContextProvider>
          <RouterProvider router={createBrowserRouter(allRoutes)} />
        </BookingContextProvider>
      </LayoutContextProvider>
    </AdminContextProvider>
  );
}

export default App;
