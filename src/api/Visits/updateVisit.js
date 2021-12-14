import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateVisit({ visit, visitId, leader }) {
  const { data, error } = await supabase.from("visits").update(visit).match({ id: visitId });

  if (error) {
    throw new Error(error.message);
  }

  let staffName = "";
  if(leader) {
      const staff = await supabase.from("staff").select("*").eq("id", leader);

      staffName = staff?.data?.[0]?.staff_name || "";
  }
  console.log("staffName", staffName);
  await updateAppenateVisits(data, staffName);

  return data;
}

export const useUpdateVisit = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((visit) => updateVisit(visit), {
    onSuccess: (data) => {
      queryClient.refetchQueries("visits");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated visit.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating visit",
        content: err?.message,
      });
    },
    mutationFn: updateVisit,
  });
};

async function updateAppenateVisits(data, staffName) {
  /*
    ROWS:
    id - Job Id - Job Display - date - vehicle Ids - vehicle display - staff ids - staff display - team leader id - task ids - task display - notes - status - risk factor - type -- additional tools - safety equipment - specialized PPE
  */
  const visitPayload = [];


  data.map((visit) =>
    visitPayload.push([
      visit.id, // id
      visit.job_id, // job Id
      "", // job display
      visit.date, // date
      "", // vehicle Ids
      "", // vehicle display
      visit?.staff_ids?.join(",") || "",
      visit?.staff_labels?.join(",") || "",
      visit?.team_leader_id || "",
      staffName || "",
      visit?.task_ids?.join(",") || "",
      visit?.task_labels?.join(",") || "",
      visit?.notes || "",
      visit?.visit_status || "",
      "",
      visit?.risk || "",
      visit?.type || "",
      "",
      "",
      "",
      "",
      "",
      "",
      visit?.vehicle_ids?.join(",") || "" || "",
      visit?.vehicle_labels?.join(",") || "" || "",
    ]),
  );
  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "b57d76e9-de1b-496f-8510-ade201690573",
    data: visitPayload,
  });
}
