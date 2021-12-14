import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { EditVisit } from "../../components/Visits";

export const EditVisitForm = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <EditVisit open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
