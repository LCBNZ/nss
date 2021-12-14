import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchJob(id) {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `*,
      clients:client_id( id, client_name ),
      job_tasks(*),
      job_handover(*),

      staff:supervisor(id, staff_name)
    `,
    )
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchJob(jobId) {
  return useQuery({
    queryKey: ["quote", jobId],
    queryFn: () => fetchJob(jobId),
  });
}
