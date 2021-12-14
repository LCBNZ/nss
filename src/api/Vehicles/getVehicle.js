import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchVehicle(id) {
  const { data, error } = await supabase.from("vehicles").select(`*`).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchVehicle(vehicleId) {
  return useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetchVehicle(vehicleId),
  });
}
