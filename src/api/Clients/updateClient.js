import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateClient({ client, clientId }) {
  const { data, error } = await supabase.from("clients").update(client).match({ id: clientId });

  if (error) {
    throw new Error(error.message);
  }

  await updateAppenateClient(data);

  return data;
}

export const useUpdateClient = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((quote) => updateClient(quote), {
    onSuccess: (data) => {
      queryClient.refetchQueries("clients");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated client.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating client",
        content: err?.message,
      });
    },
    mutationFn: updateClient,
  });
};

async function updateAppenateClient(data) {
  const clientPayload = [];

  data.map((client) =>
    clientPayload.push([
      client.id, // id
      client.client_name || "",
      client.site || "",
      client.phone || "",
      client.email || "",
      client.status || "",
    ]),
  );

  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "fac486af-a92a-4a14-a076-ade2016dea31",
    data: clientPayload,
  });
}
