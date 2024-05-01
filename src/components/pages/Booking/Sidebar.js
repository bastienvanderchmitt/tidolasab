import FormBooking from "../../formik/forms/FormBooking";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h4 className="title-2 pt-2 pb-4 text-center">Réserver</h4>
      <FormBooking />
    </div>
  );
};

export default Sidebar;
