import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllVisitsByJob({ jobId }) {

  const { data, error } = await supabase
    .from("visits")
    .select("*, staff:team_leader_id(id, staff_name), jobs:job_id(id, site) ")
    .eq("job_id", Number(jobId))
    .order("id", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useGetVisitsByJob(jobId) {
  return useQuery("visits", () => fetchAllVisitsByJob(jobId));
}
