import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

async function createTimesheet(timesheet) {
  const { data, error } = await supabase.from("timesheets").insert(timesheet);

  if (error) {
    throw new Error(error.messge);
  }
  return data;
}

export function useCreateTimesheet() {
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation((timesheet) => createTimesheet(timesheet), {
    onSuccess: () => {
      queryClient.refetchQueries("timesheets");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully created timesheets.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed creating timesheets",
        content: err?.message,
      });
    },
    mutationFn: createTimesheet,
  });
}

