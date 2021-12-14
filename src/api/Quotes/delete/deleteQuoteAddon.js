import { useMutation } from "react-query";
import supabase from "../../supabase";

export async function deleteAddon(id) {
  const { data, error } = await supabase.from("quote_addons").delete().match({ id });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useDeleteAddon = () =>
  useMutation((id) => deleteAddon(id), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: deleteAddon,
  });
