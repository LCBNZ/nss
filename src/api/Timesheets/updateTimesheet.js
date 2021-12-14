import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateTimesheet({ timesheet, timesheetId }) {
  const { data, error } = await supabase
    .from("timesheets")
    .update(timesheet)
    .match({ id: timesheetId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useUpdateTimesheet = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((timesheet) => updateTimesheet(timesheet), {
    onSuccess: (data) => {
      queryClient.refetchQueries("timesheets");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated timesheet.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating timesheet",
        content: err?.message,
      });
    },
    mutationFn: updateTimesheet,
  });
};
