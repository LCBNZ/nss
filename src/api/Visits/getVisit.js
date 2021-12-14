import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchVisit(id) {
  const { data, error } = await supabase
    .from("visits")
    .select(
      `*,
      staff:team_leader_id(*)
    `,
    )
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchVisit(visitId) {
  return useQuery({
    queryKey: ["visit", visitId],
    queryFn: () => fetchVisit(visitId),
  });
}
