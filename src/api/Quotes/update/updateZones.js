import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function updateZones(zones) {

  const { data, error } = await supabase.from("quote_zones").upsert(zones);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useUpdateZones = () =>
  useMutation((quote) => updateZones(quote), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: updateZones,
  });
