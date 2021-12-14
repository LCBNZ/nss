import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { EditJobForm } from "../../components/Jobs";

export const EditJob = (props) => {
  const [open, setOpen] = useState(true);
  const { jobId } = useParams();
  return (
    <>
      <EditJobForm open={open} setOpen={setOpen} formType="edit" />
    </>
  );
};
