import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchAsset(id) {
  const { data, error } = await supabase.from("assets").select(`*`).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchAsset(assetId) {
  return useQuery({
    queryKey: ["asset", assetId],
    queryFn: () => fetchAsset(assetId),
  });
}
