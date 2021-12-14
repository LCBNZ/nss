import { CheckIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { FileUpload, Button } from "../../../common";

export const CreateFile = ({ quoteId, status, quotePayload }) => (
  <FileUpload
    icon="info"
    title="Approve Quote"
    body="Are you sure you wish to approve this quote? This action will create a job with a list of tasks."
    triggerButton={<Button variant="primary">Create File</Button>}
    confirmButton={<Button variant="approve">Approve</Button>}
  />
);
