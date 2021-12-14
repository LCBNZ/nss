import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

async function createStaff(staff) {
  const { data, error } = await supabase.from("staff").insert(staff);

  if (error) {
    throw new Error(error.messge);
  }

  const appCreateRes = await createAppenateStaff(data);



  return data;
}

export function useCreateStaff() {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((staff) => createStaff(staff), {
    onSuccess: () => {
      queryClient.refetchQueries("staff");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully created staff member.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed creating staff",
        content: err?.message,
      });
    },
    mutationFn: createStaff,
  });
}

async function createAppenateStaff(staff) {
  const jobsPayload = [];
  staff.map((person) =>
    jobsPayload.push([person.id, person.staff_name, person.email, person.pin, person.status]),
  );

  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "22501bb0-75d3-42b2-9959-addc016c8584",
    data: jobsPayload,
  });
}
