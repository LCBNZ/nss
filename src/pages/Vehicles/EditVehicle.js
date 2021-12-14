import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { EditVehicleForm } from "../../components/Vehicles/EditVehicle";

export const EditVehicle = (props) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <EditVehicleForm open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
