import React from "react";
import axios from "axios";
import { CheckIcon } from "@heroicons/react/outline";
import moment from "moment-business-days";
import { ConfirmationDialog, Button } from "../../common";
import { LeaveApi, TimesheetsApi } from "../../api";
import { useNotificationStore } from "../../store/notifications";

import supabase from "../../api/supabase";

export const ApproveLeave = ({ staffId, staff, email, leaveId, start, end, type, comments }) => {
  console.log("staffId >>> ", staffId, type);
  const [isDone, setIsDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { addNotification } = useNotificationStore();
  const updateLeave = LeaveApi.useUpdateLeave();
  const createTimesheets = TimesheetsApi.useCreateTimesheet();

  return (
    <ConfirmationDialog
      isDone={isDone}
      icon="info"
      title="Approve"
      body="Are you sure you wish to approve this leave? An email will be sent to this user confirming approval"
      triggerButton={
        <Button variant="approveInverse" size="xs">
          Approve
        </Button>
      }
      confirmButton={
        <Button
          isLoading={isLoading}
          variant="approve"
          onClick={async (e) => {
            setIsLoading(true);
            const loggedInuser = await supabase.auth.user();
            const approvedBy = loggedInuser?.user_metadata?.name;

            const title = `Your leave request has been approved`;
            const body = formatBody(staff, start, end, approvedBy);
            try {
              const result = await axios.post(
                "https://scaff-m8-server.herokuapp.com/api/process-email",
                {
                  title,
                  body,
                  emailTo: email,
                },
              );

              console.log("RESULT >>> ", result);
              const status = result?.status;
              addNotification({
                isSuccess: status === 200 ? true : false,
                heading:
                  status === 200 ? "Successfully dispatched email" : "Failed to dispatch email",
                content:
                  status === 200
                    ? "Sent email to recipient."
                    : "There was an error dispatching email",
              });
            } catch (err) {
              console.log("ERROR >>>> ", err);
              addNotification({
                isSuccess: false,
                heading: "Failed to dispatch email",
                content: "There was an error dispatching email",
              });
            }
            try {
              await updateLeave.mutateAsync({
                leave: {
                  status: "Approved",
                  approved_by: approvedBy,
                },
                leaveId,
              });
            } catch (err) {
              console.log("ERROR APPROVING");
            }

            const days = enumerateDaysBetweenDates(start, end);
            console.log("days >>>>>>> ", days);

            const timesheets = formatTimesheetPayload(days, staffId, type, comments, approvedBy);

            console.log("TIMESHEETS >>>> ", timesheets)

            try {
              await createTimesheets.mutateAsync(timesheets);
            } catch(err) {
              console.log("ERROR CREATING TIMESHEETS >>>> ", err)
            }

            setIsLoading(false);
            setIsDone(true);
          }}
        >
          Approve
        </Button>
      }
    />
  );
};

function formatBody(staff, start, end, name) {
  return `Hi ${staff},

Your leave request has been approved from ${start} to ${end}.
Approved by: ${name} (${moment().format("DD/MM/YYYY")})

Please do not respond to this email.
`;
}

function enumerateDaysBetweenDates(startDate, endDate) {
  const end = moment(endDate, "DD/MM/YYYY");
  const start = moment(startDate, "DD/MM/YYYY");
  const result = [moment({ ...start })];

  if (end.diff(start, "days") >= 0) {
    while (end.date() !== start.date()) {
      start.add(1, "day");
      if (start.isBusinessDay()) result.push(moment({ ...start }));
    }
  }

  return result.map((x) => x.format("DD/MM/YYYY"));
}

function formatTimesheetPayload(dates, staffId, type, comments, approvedBy) {
  return dates.map((date) => ({
    date,
    staff_id: staffId,
    time_on: "09:00",
    time_off: "17:00",
    comments: `Leave Type: ${type}
${comments}`,
    status: "Approved",
    approved_by: approvedBy,
  }));
}
