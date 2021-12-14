import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllStaff() {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq('status', 'Active')
    .order("staff_name", { ascending: true });;

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useStaff() {
  return useQuery("staff", () => fetchAllStaff());
}
