import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateTag({ tag, tagId }) {
  const { data, error } = await supabase.from("scaffold_tags").update(tag).match({ id: tagId });

  if (error) {
    throw new Error(error.message);
  }

  try {
    await updateAppenateTags(data);
  } catch (err) {
    console.log("Failed to update tag");
  }

  return data;
}

export const useUpdateTag = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((tag) => updateTag(tag), {
    onSuccess: (data) => {
      queryClient.refetchQueries("tags");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated tag.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating tag",
        content: err?.message,
      });
    },
    mutationFn: updateTag,
  });
};

async function updateAppenateTags(data) {
  const tagPayload = [];

  data.map((tag) =>
    tagPayload.push([
      tag.id, // id
      tag.tag_no || "",
      tag.job_id || "",
      tag.description || "",
      tag.last_inspection || "",
      tag.inspection_due || "",
      tag.status || "",
    ]),
  );
  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "ed272891-c67a-4562-b985-adef0182f1ab",
    data: tagPayload,
  });
}
