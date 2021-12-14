import { useMutation, useQueryClient } from "react-query";
import supabase from "../../supabase";

import { useNotificationStore } from "../../../store/notifications";

export const deleteTask = async (taskId) => {
  const { data, error } = await supabase
    .from("job_tasks")
    .delete()
    .match({ id: Number(taskId) });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useDeleteTask = ({ taskId }) => {
    const { addNotification } = useNotificationStore();

    const queryClient = useQueryClient();

  return useMutation(() => deleteTask(taskId), {
    onSuccess: () => {
      queryClient.refetchQueries("tasks");
      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully deleted task.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed deleting task",
        content: err?.message,
      });
    },
    mutationFn: deleteTask,
  });
};
