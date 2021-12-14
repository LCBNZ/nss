import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllNotes(column, id) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq(column, Number(id))
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useFetchNotes({ column, id }) {
  return useQuery("notes", () => fetchAllNotes(column, id));
}
