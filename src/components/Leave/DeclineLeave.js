import React from "react";
import moment from "moment";
import axios from "axios";
import { XIcon } from "@heroicons/react/outline";
import { ConfirmationDialog, Button } from "../../common";
import { LeaveApi } from "../../api";
import { useNotificationStore } from "../../store/notifications";

import supabase from "../../api/supabase";

export const DeclineLeave = ({ staff, email, leaveId, start, end }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { addNotification } = useNotificationStore();
  const updateLeave = LeaveApi.useUpdateLeave();

  return (
    <ConfirmationDialog
      isDone={updateLeave.isSuccess}
      icon="danger"
      title="Decline"
      body="Are you sure you wish to decline this leave? An email will be sent to this user confirming leave decline"
      triggerButton={
        <Button variant="declineInverse" size="xs">
          Decline
        </Button>
      }
      confirmButton={
        <Button
          isLoading={isLoading}
          variant="danger"
          onClick={async (e) => {
            setIsLoading(true);
            const loggedInuser = await supabase.auth.user();
            const name = loggedInuser?.user_metadata?.name;

            const title = `Your leave request has been declined`;
            const body = formatBody(staff, start, end, name);
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
                  status: "Declined",
                },
                leaveId,
              });
            } catch (err) {
              console.log("ERROR APPROVING");
            }

            setIsLoading(false);
          }}
        >
          Decline
        </Button>
      }
    />
  );
};

function formatBody(staff, start, end, name) {
  return `Hi ${staff},

Your leave request has been declined from ${start} to ${end}. Please contact the office administration if you have any questions.
Declined by: ${name} (${moment().format("DD/MM/YYYY")}).

Please do not respond to this email.
`;
}
