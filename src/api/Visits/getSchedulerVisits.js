import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllSchedulerVisits() {
  const { data, error } = await supabase
    .from("visits")
    .select("*, staff:team_leader_id(id, staff_name), jobs:job_id(id, site) ")
    .eq("status", 'Active')
    .order("id", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useSchedulerVisits() {
  return useQuery("visits", () => fetchAllSchedulerVisits());
}
