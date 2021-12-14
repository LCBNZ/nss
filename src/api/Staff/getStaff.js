import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchStaff(id) {
  const { data, error } = await supabase.from("staff").select("*").eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchStaff(staffId) {
  return useQuery({
    queryKey: ["staff", staffId],
    queryFn: () => fetchStaff(staffId),
  });
}
