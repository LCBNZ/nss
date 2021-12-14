import { useMutation, useQueryClient } from "react-query";

import supabase from "../supabase";
import { useNotificationStore } from "../../store/notifications";

export async function bulkApprove(timesheets) {

  const { data, error } = await supabase.from("timesheets").upsert(timesheets);

  if (error) throw new Error(error.message);

  return data;
}

export function useBulkApprove() {
  //
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation(({ selectedTimesheets }) => bulkApprove(selectedTimesheets), {
    onSuccess: () => {
      queryClient.refetchQueries("timesheets");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: "Successfully Approved all timesheets!",
      });
    },
  });
}
