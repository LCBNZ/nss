import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/outline";

import { Button, ConfirmationDialog } from "../../../common";

import { JobsApi } from "../../../api";

export const DeleteTask = ({ taskId }) => {
  const deleteFileMutation = JobsApi.useDeleteTask({ taskId });

  return (
    <ConfirmationDialog
      isDone={deleteFileMutation.isSuccess}
      icon="danger"
      title="Delete Task"
      body="Are you sure you want to delete this task? This action is unrecoverable!"
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
            await deleteFileMutation.mutateAsync({ taskId });
            // window.location.reload(false);
          }}
        >
          Delete Task
        </Button>
      }
    />
  );
};
