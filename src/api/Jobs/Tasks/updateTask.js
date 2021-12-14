import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../../supabase";

import { useNotificationStore } from "../../../store/notifications";

async function updateTask({ payload, taskId }) {
  const { data, error } = await supabase.from("job_tasks").update(payload).match({ id: taskId });

  if (error) {
    throw new Error(error.messge);
  }

  try {
     await updateAppenateTask(data)
  } catch(err) {
    console.log("Error updating task")
  }

  return data;
}

export function useUpdateTask() {
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation((payload) => updateTask(payload), {
    onSuccess: () => {
      queryClient.refetchQueries("tasks");
      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated task.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed update task",
        content: err?.message,
      });
    },
    mutationFn: updateTask,
  });
}

async function updateAppenateTask(tasks) {
  const taskPayload = [];

  tasks.map((task) =>
    taskPayload.push([
      task.id,
      task.job_id || "",
      task.zone || "",
      task.zone_label || "",
      `${task.type} - ${task.description}`,
      task.description || "",
      task.complete || "",
    ]),
  );
  console.log("taskPayload >>>> ", taskPayload);
  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "64cbf15a-a268-4ed8-ade3-ade3017066e4",
    data: taskPayload,
  });
}
