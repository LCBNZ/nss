import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { EditInvestigationForm } from "../../components/Investigations";

export const EditInvestigation = (props) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <EditInvestigationForm open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
