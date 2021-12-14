import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

async function createJob(job) {
  const { data, error } = await supabase.from("jobs").insert(job);

  if (error) {
    throw new Error(error.messge);
  }

  await createAppenateJob(data)

  return data;
}

export function useCreateJob() {
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation((job) => createJob(job), {
    onSuccess: () => {
      queryClient.refetchQueries("jobs");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully created job.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed creating job",
        content: err?.message,
      });
    },
    mutationFn: createJob,
  });
}

async function createAppenateJob(jobs) {
  /*
    ROWS:
    id - job # - Client Id - Client Name - Client Contact # - Site - Job description - Status - Truck Driver - Supervisor -
  */

  const jobsPayload = [];

  jobs.map((job) =>
    jobsPayload.push([
      job.id,
      job.id + 1000,
      "",
      job.client_id,
      "",
      "",
      "",
      job.site || "",
      "",
      job.job_status || "",
      job?.truck_driver || "",
      job?.supervisor || "",
    ]),
  );

  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "23d44eb4-0d02-4b1c-a573-ade201614c25",
    data: jobsPayload,
  });
}
