import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchVisitTimesheets(id) {
  const { data, error } = await supabase
    .from("visit_timesheets")
    .select(
      `*,
      visits:visit_id(*),
      staff:supervisor_id(id)
    `,
    )
    .eq("job_id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useFetchVisitTimesheets(jobId) {
  return useQuery({
    queryKey: ["visitTimesheets", jobId],
    queryFn: () => fetchVisitTimesheets(jobId),
  });
}
