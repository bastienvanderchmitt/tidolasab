import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

const Base = () => {
  return (
    <>
      <Toaster />
      <Menu />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Base;
