import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { EditLeaveForm } from "../../components/Leave";

export const EditLeave = (props) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <EditLeaveForm open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
