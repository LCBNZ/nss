import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function updateLines(lines) {
  const { data, error } = await supabase.from("quote_lines").upsert(lines);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useUpdateLines = () =>
  useMutation((lines) => updateLines(lines), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: updateLines,
  });
