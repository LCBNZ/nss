import { useMutation, useQueryClient } from "react-query";

import supabase from "../supabase";
import { useNotificationStore } from "../../store/notifications";

export async function updateTimesheetStatus(id, status) {

  const { data, error } = await supabase
    .from("timesheets")
    .update({
      status,
    })
    .match({ id });

  if (error) throw new Error(error.message);

  return data;
}

export function useUpdateTimesheetStatus(timesheetId, status) {
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation(() => updateTimesheetStatus(timesheetId, status), {
    onSuccess: () => {
      queryClient.refetchQueries("timesheets");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content:
          status === "Approved"
            ? "Successfully approved timesheet!"
            : "Successfuly rejected timesheet!",
      });
    },
  });
}
