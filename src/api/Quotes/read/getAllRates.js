import { useQuery } from "react-query";
import supabase from "../../supabase";

export async function fetchRates() {
  const { data, error } = await supabase.from("service_rates").select("*").order("id", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useFetchRates() {
  return useQuery("rates", () => fetchRates());
}
