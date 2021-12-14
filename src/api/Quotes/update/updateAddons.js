import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function updateAddons(addons) {

  const { data, error } = await supabase.from("quote_addons").upsert(addons);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useUpdateAddons = () =>
  useMutation((addons) => updateAddons(addons), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: updateAddons,
  });
