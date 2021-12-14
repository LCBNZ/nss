import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateJob({ job, jobId }) {

  const { data, error } = await supabase.from("jobs").update(job).match({ id: jobId });

  if (error) {
    throw new Error(error.message);
  }

  await updateAppenateJob(data)

  return data;
}

export const useUpdateJob = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((job) => updateJob(job), {
    onSuccess: (data) => {
      queryClient.refetchQueries("jobs");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated job.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating job",
        content: err?.message,
      });
    },
    mutationFn: updateJob,
  });
};

async function updateAppenateJob(jobs) {
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
