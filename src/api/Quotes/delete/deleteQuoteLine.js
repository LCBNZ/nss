import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function deleteLines(id) {
  const { data, error } = await supabase.from("quote_lines").delete().match({ id });

  if (error) {

    throw new Error(error.message);
  }

  return data;
}

export const useDeleteLine = () =>
  useMutation((id) => deleteLines(id), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: deleteLines,
  });
