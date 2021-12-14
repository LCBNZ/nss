import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { ClientForm } from "../../components/Clients";

export const EditClient = (props) => {
  const [open, setOpen] = useState(true);
  const { clientId } = useParams();
  return (
    <>
      <ClientForm heading="Update Client" open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
