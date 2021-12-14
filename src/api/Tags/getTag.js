import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchTag(id) {
  const { data, error } = await supabase.from("scaffold_tags").select(`*, jobs:job_id(*)`).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchTag(tagId) {
  return useQuery({
    queryKey: ["tag", tagId],
    queryFn: () => fetchTag(tagId),
  });
}
