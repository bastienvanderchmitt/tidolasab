import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { adminRoutes } from "../../routes/allRoutes";

const BreadCrumb = ({ button }) => {
  const location = useLocation();
  const { id } = useParams();

  const currentLocation = adminRoutes?.find(
    (r) => r.path === location.pathname.replace(id, ":id"),
  );

  return (
    <div className="mt-3 mb-5">
      <div className="rounded px-3 py-3" style={{ backgroundColor: "#dee2e6" }}>
        <div className="row gx-3 align-items-center">
          <div className="col-12 col-md mb-2 mb-sm-0">
            <p className="h5">{currentLocation?.label}</p>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <Link className="breadcrumb-item bi" to={"/admin"}>
                  Home
                </Link>
                <li className="breadcrumb-item active bi" aria-current="page">
                  {currentLocation?.label}
                </li>
              </ol>
            </nav>
          </div>
          {!!button ? (
            <div className="col-auto">
              <div className="d-flex text-center">{button}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BreadCrumb;
