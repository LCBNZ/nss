import { useQuery } from "react-query";
import supabase from "../../supabase";

async function fetchAllVariationTasks(jobId) {

  const { data, error } = await supabase
    .from("job_tasks")
    .select("*, quotes:variation_quote_id(id, quote_num)")
    .eq("job_id", Number(jobId))
    .eq("task_type", "Variation")
    .order("id", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useVariationTasks(jobId) {
  return useQuery("variation_tasks", () => fetchAllVariationTasks(jobId));
}
