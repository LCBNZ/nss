import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchAllStaffLeave(staffId) {
  const { data, error } = await supabase
    .from("leave")
    .select("*, staff:staff_id(id, staff_name, email)")
    .eq("staff_id", Number(staffId))
    .order("staff_id", { ascending: false })
    .order("id", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data
}

export function useStaffLeave(staffId) {
  return useQuery("staffLeave", () => fetchAllStaffLeave(staffId));
}

