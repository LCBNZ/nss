import { XIcon } from "@heroicons/react/outline";
import { ConfirmationDialog, Button } from "../../common";
import { TimesheetsApi } from "../../api";

export const DeclineTimesheet = ({ timesheetId, hasFinished }) => {
  const updateApproveStatus = TimesheetsApi.useUpdateTimesheetStatus(timesheetId, "Rejected");

  return (
    <ConfirmationDialog
      isDone={updateApproveStatus.isSuccess}
      icon="danger"
      title="Decline Timesheet"
      body="Are you sure you wish to decline this timesheet?"
      triggerButton={
        <button
          type="button"
          id={timesheetId}
          className={
            hasFinished
              ? "ml-3 inline-flex items-center text-sm font-medium focus:outline-none hover:text-red-400"
              : "ml-3 inline-flex items-center text-sm text-gray-200"
          }
          disabled={!hasFinished}
        >
          <XIcon className="-ml-0.5 mr-2 h-4 w-4 text-red-400" aria-hidden="true" />
          Decline
        </button>
      }
      confirmButton={
        <Button
          isLoading={updateApproveStatus?.isLoading}
          variant="danger"
          onClick={async (e) => {
            try {
              await updateApproveStatus.mutateAsync({ timesheetId, status: "Declined" });
            } catch (err) {
              console.log("ERROR APPROVING: ", err);
            }
          }}
        >
          Decline
        </Button>
      }
    />
  );
};
