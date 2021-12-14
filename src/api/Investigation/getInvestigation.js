import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchInvestigation(id) {
  const { data, error } = await supabase.from("investigation_reports").select("*").eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchInvestigation(investigationId) {
  return useQuery({
    queryKey: ["investigation", investigationId],
    queryFn: () => fetchInvestigation(investigationId),
  });
}
