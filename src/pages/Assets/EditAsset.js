import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { EditAssetForm } from "../../components/Assets";

export const EditAsset = (props) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <EditAssetForm open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
