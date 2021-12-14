import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

async function createClient(client) {
  const { data, error } = await supabase.from("clients").insert(client);

  if (error) {
    throw new Error(error.messge);
  }

  await createAppenateClients(data);

  return data;
}

export function useCreateClient() {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((client) => createClient(client), {
    onSuccess: () => {
      queryClient.refetchQueries("clients");
      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully created client.`,
      });
    },
    onError: (err) => {

      addNotification({
        isSuccess: false,
        heading: "Failed creating client",
        content: err?.message,
      });
    },
    mutationFn: createClient,
  });
}

async function createAppenateClients(data) {
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
