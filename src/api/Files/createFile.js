import { useMutation, useQueryClient } from "react-query";
import supabase from "../supabase";

async function createFile(payload) {

  const { data, error } = await supabase.from("files").insert(payload);

  if (error) {

    throw new Error(error.message);
  }
  return data;
}

export function useCreateFile() {
  const queryClient = useQueryClient();

  return useMutation((payload) => createFile(payload), {
    onSuccess: () => {
      queryClient.refetchQueries("files");
    },
  });
}
