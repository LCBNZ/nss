import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { EditTimesheet } from "../../components/Timesheet";

export const Edit = (props) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <EditTimesheet open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
