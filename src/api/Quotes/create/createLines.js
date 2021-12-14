import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function createLines(lines) {
  const { data, error } = await supabase.from("quote_lines").insert(lines);

  if (error) {
    throw new Error(error.messge);
  }
  return data;
}

export const useCreateLines = () =>
  useMutation((lines) => createLines(lines), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: createLines,
  });
