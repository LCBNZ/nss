import { useMutation, useQueryClient } from "react-query";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateLeave({ leave, leaveId }) {
  const { data, error } = await supabase.from("leave").update(leave).match({ id: leaveId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useUpdateLeave = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((leave) => updateLeave(leave), {
    onSuccess: (data) => {
      queryClient.refetchQueries("leave");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated leave.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating leave",
        content: err?.message,
      });
    },
    mutationFn: updateLeave,
  });
};
