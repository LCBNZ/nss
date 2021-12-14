import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function createZones(quote) {
  const { data, error } = await supabase.from("quote_zones").insert(quote);

  if (error) {
    throw new Error(error.messge);
  }
  return data;
}

export const useCreateZones = () =>
  useMutation((quote) => createZones(quote), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: createZones,
  });
