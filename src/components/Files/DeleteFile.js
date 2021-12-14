import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/outline";

import { Button, ConfirmationDialog } from "../../common";

import { FilesApi } from "../../api";

export const DeleteFile = ({ fileId }) => {
  const deleteFileMutation = FilesApi.useDeleteFile({ fileId });
  //
  return (
    <ConfirmationDialog
      isDone={deleteFileMutation.isSuccess}
      icon="danger"
      title="Delete File"
      body="Are you sure you want to delete this file? This action is unrecoverable!"
      triggerButton={
        <button type="button">
          <TrashIcon className="text-red-400 h-4 w-4" />
        </button>
      }
      confirmButton={
        <Button
          type="button"
          variant="danger"
          className="bg-red-600"
          onClick={async () => {
            const deleteResult = await deleteFileMutation.mutateAsync({ fileId });


          }}
        >
          Delete File
        </Button>
      }
    />
  );
};
