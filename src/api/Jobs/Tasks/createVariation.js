import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../../supabase";

import { useNotificationStore } from "../../../store/notifications";

async function createVariation(payload) {
  const { data, error } = await supabase.from("job_tasks").insert(payload);

  if (error) {
    throw new Error(error.messge);
  }
  await createAppenateTask(data);
  return data;
}

export function useCreateVariation() {
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation((payload) => createVariation(payload), {
    onSuccess: () => {
      queryClient.refetchQueries("variation_tasks");
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
    mutationFn: createVariation,
  });
}

async function createAppenateTask(jobs) {
  const tasksPayload = [];

  jobs.map((task) =>
    tasksPayload.push([
      task.id,
      task?.job_id || "",
      task.zone || "",
      task.zone_label || "",
      task.type || "",
      task.description || "",
      task.total_hours || "",
    ]),
  );

  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "64cbf15a-a268-4ed8-ade3-ade3017066e4",
    data: tasksPayload,
  });
}
