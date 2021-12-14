import { useMutation, useQueryClient } from "react-query";
import axios from 'axios'
import supabase from "../../supabase";

import { useNotificationStore } from "../../../store/notifications";

async function createTask(payload) {
  const { data, error } = await supabase.from("job_tasks").insert(payload);

  if (error) {
    throw new Error(error.messge);
  }
  await createAppenateTask(data)
  return data;
}

export function useCreateTask() {
  const { addNotification } = useNotificationStore();

   const queryClient = useQueryClient();

  return useMutation((payload) => createTask(payload), {
    onSuccess: () => {
      queryClient.refetchQueries("tasks");
      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully created task.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed creating task",
        content: err?.message,
      });
    },
    mutationFn: createTask,
  });
}

async function createAppenateTask(jobs) {
  const tasksPayload = [];

  jobs.map((task) =>
    tasksPayload.push([
      task.id,
      task.job_id || "",
      task.zone || "",
      task.zone_label || "",
      `${task.type} - ${task.description}`,
      task.description || "",
      task.complete || "",
    ]),
  );

    return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
      id: "64cbf15a-a268-4ed8-ade3-ade3017066e4",
      data: tasksPayload,
    });
}
