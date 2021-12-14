import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { EditTagForm } from "../../components/Tags/EditTag";

export const EditTag = (props) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <EditTagForm open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
