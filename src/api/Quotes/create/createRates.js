import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function createRates(rates) {
  const { data, error } = await supabase.from("quote_rates").insert(rates);

  if (error) {

    throw new Error(error.message);
  }

  return data;
}

export const useCreateRates = () =>
  useMutation((rates) => createRates(rates), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: createRates,
  });
