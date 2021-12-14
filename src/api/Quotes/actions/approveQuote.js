import { useMutation, useQueryClient } from "react-query";

import supabase from "../../supabase";
import { useNotificationStore } from "../../../store/notifications";

export async function updateQuoteStatus(id, payload) {
  const { approvedBy, clientApproved, description, status } = payload;
  const { data, error } = await supabase
    .from("quotes")
    .update({
      approved_by: approvedBy,
      client_approved: clientApproved,
      confirmed_description: description,
      status,
    })
    .match({ id });

  if (error) throw new Error(error.message);

  return data;
}

export function useUpdateQuoteStatus(quoteId, payload) {
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation(() => updateQuoteStatus(quoteId, payload), {
    onSuccess: () => {
      queryClient.refetchQueries("quotes");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content:
          payload?.status === "Approved"
            ? "Successfully approved quote!"
            : "Successfuly rejected quote!",
      });
    },
  });
}
