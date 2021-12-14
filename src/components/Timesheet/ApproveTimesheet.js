import { CheckIcon } from "@heroicons/react/outline";
import { ConfirmationDialog, Button } from "../../common";
import { TimesheetsApi } from "../../api";

import supabase from "../../api/supabase";

export const ApproveTimesheet = ({ timesheets }) => {
  const bulkApproveTimesheets = TimesheetsApi.useBulkApprove();

  return (
    <ConfirmationDialog
      isDone={bulkApproveTimesheets.isSuccess}
      icon="info"
      title="Approve Timesheet"
      body="Are you sure you wish to approve this timesheet?"
      triggerButton={
        <Button
          variant="approve"
          startIcon={<CheckIcon className="-ml-0.5 mr-2 h-4 w-4 text-white" aria-hidden="true" />}
        >
          Approve Timesheets
        </Button>
      }
      confirmButton={
        <Button
          isLoading={bulkApproveTimesheets?.isLoading}
          variant="approve"
          onClick={async (e) => {
            const loggedInuser = await supabase.auth.user();
            const name = loggedInuser?.user_metadata?.name;
            const selectedTimesheets = timesheets.map((row) => ({
              id: row?.id,
              status: "Approved",
              approved_by: name,
            }));
            console.log("selectedTimesheets RESULT", selectedTimesheets);
            try {
              await bulkApproveTimesheets.mutateAsync({ selectedTimesheets });
            } catch (err) {
              console.log("ERROR BULK APPROVING");
            }
          }}
        >
          Approve
        </Button>
      }
    />
  );
};
