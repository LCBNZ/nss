import { useMutation, useQueryClient } from "react-query";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

async function createContact(contact) {
  const { data, error } = await supabase.from("client_contacts").insert(contact);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useCreateContact() {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((contact) => createContact(contact), {
    onSuccess: () => {
      queryClient.refetchQueries("client_contacts");
      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully created contact.`,
      });
    },
    onError: (err) => {

      addNotification({
        isSuccess: false,
        heading: "Failed creating contact",
        content: err?.message,
      });
    },
    mutationFn: createContact,
  });
}
