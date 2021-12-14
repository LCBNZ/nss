import { useMutation, useQueryClient } from "react-query";
import supabase from "../../supabase";

export async function createQuote(quote) {

  const { data, error } = await supabase.from("quotes").insert(quote);

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export const useCreateQuote = () =>
  useMutation((quote) => createQuote(quote), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: createQuote,
  });
