import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

async function updateHandover({payload, handoverId}) {
  const { data, error } = await supabase
    .from("job_handover")
    .update(payload)
    .match({ id: handoverId });

  if (error) {
    throw new Error(error.messge);
  }

  await updateAppenateHandover(data);

  return data;
}

export function useUpdateJobHandover() {
  const { addNotification } = useNotificationStore();

  return useMutation((payload) => updateHandover(payload), {
    onSuccess: () => {
      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated handover.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating handover",
        content: err?.message,
      });
    },
    mutationFn: updateHandover,
  });
}

async function updateAppenateHandover(handover) {
  const jobsPayload = [];

  handover.map((item) =>
    jobsPayload.push([
      item.id,
      item.job_id || "",
      item.hs_officer || "",
      item.hs_officer_phone || "",
      item.hs_officer_email || "",
      item.site_forman || "",
      item.site_forman_phone || "",
      item.site_forman_email || "",
    ]),
  );

  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "ab3f4c0f-03c7-4ab9-86d0-ade201738a6f",
    data: jobsPayload,
  });
}
