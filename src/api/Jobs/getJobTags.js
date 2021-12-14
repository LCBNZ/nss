import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchJobTags(id) {
  const { data, error } = await supabase
    .from("scaffold_tags")
    .select("*")
    .eq("job_id", id)
    .order("tag_no", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useFetchJobTags(jobId) {
  return useQuery({
    queryKey: ["tags", jobId],
    queryFn: () => fetchJobTags(jobId),
  });
}
