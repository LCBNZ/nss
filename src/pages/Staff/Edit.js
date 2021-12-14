import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { StaffForm } from "../../components/Staff";

export const EditStaff = (props) => {
  const [open, setOpen] = useState(true);
  const { staffId } = useParams();

  return (
    <>
      <StaffForm open={open} setOpen={setOpen} formType="edit" />
    </>
  )
};
