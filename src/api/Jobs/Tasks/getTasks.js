import { useQuery } from "react-query";
import supabase from "../../supabase";

async function getAllTasks(jobId) {

  const { data, error } = await supabase
    .from("job_tasks")
    .select("*")
    .eq("job_id", Number(jobId))
    .order("id", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function getTasks(jobId) {
  return useQuery("tasks", () => getAllTasks(jobId));
}
