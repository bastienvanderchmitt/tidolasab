import "./assets/app.scss";
import "animate.css/animate.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "./routes/allRoutes";
import LayoutContextProvider from "./contexts/LayoutContext";
import BookingContextProvider from "./contexts/BookingContext";
import AdminContextProvider from "./contexts/AdminContext";
import DialogContextProvider from "./contexts/DialogContext";

function App() {
  return (
    <AdminContextProvider>
      <LayoutContextProvider>
        <DialogContextProvider>
          <BookingContextProvider>
            <RouterProvider router={createBrowserRouter(allRoutes)} />
          </BookingContextProvider>
        </DialogContextProvider>
      </LayoutContextProvider>
    </AdminContextProvider>
  );
}

export default App;
