import { useMutation, useQueryClient } from "react-query";
import supabase from "../supabase";

async function createNote(payload) {
  const { data, error } = await supabase.from("notes").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation((payload) => createNote(payload), {
    onSuccess: () => {
      queryClient.refetchQueries("notes");
    },
  });
}
