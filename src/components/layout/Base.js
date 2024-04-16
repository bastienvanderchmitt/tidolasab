import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import Footer from "./Footer";

const Base = () => {
  return (
    <>
      <Menu />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Base;
