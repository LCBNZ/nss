import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function createAddons(addons) {
  const { data, error } = await supabase.from("quote_addons").insert(addons);

  if (error) {
    throw new Error(error.messge);
  }
  return data;
}

export const useCreateAddons = () =>
  useMutation((addons) => createAddons(addons), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: createAddons,
  });
