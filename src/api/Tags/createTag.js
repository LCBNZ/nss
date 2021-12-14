import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

async function createTag(tag) {
  const { data, error } = await supabase.from("scaffold_tags").insert(tag);

  if (error) {
    throw new Error(error.messge);
  }

  try {
    await createAppenateTags(data);
  } catch (err) {
    console.log("Failed to create tag");
  }

  return data;
}

export function useCreateTag() {
  const { addNotification } = useNotificationStore();

  const queryClient = useQueryClient();

  return useMutation((tag) => createTag(tag), {
    onSuccess: () => {
      queryClient.refetchQueries("tags");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully created tag.`,
      });
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed creating tag",
        content: err?.message,
      });
    },
    mutationFn: createTag,
  });
}

async function createAppenateTags(data) {
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
