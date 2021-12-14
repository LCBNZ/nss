import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllClients() {
  const { data, error } = await supabase.from("clients").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export const useClients = () => useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchAllClients(),
  });
