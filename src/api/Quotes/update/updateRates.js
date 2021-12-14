import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function updateRates(rates) {
  const { data, error } = await supabase.from("quote_rates").upsert(rates);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useUpdateRates = () =>
  useMutation((rates) => updateRates(rates), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: updateRates,
  });
