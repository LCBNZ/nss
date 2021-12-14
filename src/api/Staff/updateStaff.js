import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateStaff({ staff, staffId }) {
  const { data, error } = await supabase.from("staff").update(staff).match({ id: staffId });

  if (error) {
    throw new Error(error.message);
  }

  const appUpdateRes = await updateAppenateStaff(data);



  return data;
}

export const useUpdateStaff = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((quote) => updateStaff(quote), {
    onSuccess: (data) => {
      queryClient.refetchQueries("staff");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated staff member.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating staff",
        content: err?.message,
      });
    },
    mutationFn: updateStaff,
  });
};

async function updateAppenateStaff(staff) {
  const jobsPayload = [];
  staff.map((person) =>
    jobsPayload.push([
      person.id,
      person.staff_name,
      person.email,
      person.pin,
      person.status,
    ]),
  );

  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "22501bb0-75d3-42b2-9959-addc016c8584",
    data: jobsPayload,
  });
}
