import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchTimesheet(id) {

  const { data, error } = await supabase
    .from("timesheets")
    .select("*, staff:staff_id(id, staff_name), job:job_id(id, site)")
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchTimesheet(timesheetId) {
  return useQuery({
    queryKey: ["timesheet", timesheetId],
    queryFn: () => fetchTimesheet(timesheetId),
  });
}
