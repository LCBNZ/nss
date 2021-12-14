import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, clients:client_id( id, client_name )")
    .order("id", { ascending: false });
    // .select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useJobs() {
  return useQuery("jobs", () => fetchAllJobs());
}
