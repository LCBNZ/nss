import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllInvestigations() {
  const { data, error } = await supabase
    .from("investigation_reports")
    .select("*, staff:assigned_to(id, staff_name)")
    .order("id", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useInvestigations() {
  return useQuery("investigations", () => fetchAllInvestigations());
}
