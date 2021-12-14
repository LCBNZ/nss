import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchLeave(id) {
  const { data, error } = await supabase
    .from("leave")
    .select("*, staff:staff_id(id, staff_name)")
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchLeave(leaveId) {
  return useQuery({
    queryKey: ["leave", leaveId],
    queryFn: () => fetchLeave(leaveId),
  });
}
