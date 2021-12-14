import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function updateQuote({ quote, quoteId }) {
  const { data, error } = await supabase.from("quotes").update(quote).match({ id: quoteId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useUpdateQuote = () =>
  useMutation((quote) => updateQuote(quote), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: updateQuote,
  });
