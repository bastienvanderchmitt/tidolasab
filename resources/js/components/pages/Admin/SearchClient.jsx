import SearchSelect from "../../common/SearchSelect";
import React from "react";
import { Formik } from "formik";
import useApi from "../../../hooks/useApi";
import { getClients } from "../../../api/client";
import { useNavigate } from "react-router-dom";

const SearchClient = () => {
  const [{ clients }] = useApi(getClients);
  const navigate = useNavigate();
  return (
    <Formik initialValues={{ client: "" }}>
      <SearchSelect
        valueName="client"
        array={clients?.map((c) => {
          return {
            id: c.id,
            text: c.nom,
          };
        })}
        callback={(id) => navigate("/admin/client/" + id)}
      />
    </Formik>
  );
};

export default SearchClient;
