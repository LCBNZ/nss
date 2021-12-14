import { useQuery } from "react-query";
import supabase from "../../supabase";

async function fetchAllTasks(jobId) {

  const { data, error } = await supabase
    .from("job_tasks")
    .select("*")
    .eq("job_id", Number(jobId))
    .eq("task_type", "New")
    .order("id", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useTasks(jobId) {
  return useQuery("tasks", () => fetchAllTasks(jobId));
}
