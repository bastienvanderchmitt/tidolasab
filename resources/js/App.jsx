import "./assets/app.scss";
import "animate.css/animate.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queries";
import { allRoutes } from "./routes/allRoutes";
import LayoutContextProvider from "./contexts/LayoutContext";
import BookingContextProvider from "./contexts/BookingContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutContextProvider>
        <BookingContextProvider>
          <RouterProvider router={createBrowserRouter(allRoutes)} />
        </BookingContextProvider>
      </LayoutContextProvider>
    </QueryClientProvider>
  );
}

export default App;
