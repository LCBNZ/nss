import { useQuery } from "react-query";
import supabase from "../../supabase";

export async function fetchTask(id) {
  const { data, error } = await supabase
    .from("job_tasks")
    .select("*")
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchTask(taskId) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(taskId),
  });
}
