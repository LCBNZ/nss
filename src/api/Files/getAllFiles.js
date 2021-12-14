import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllFiles(column, id) {

  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq(column, Number(id))
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useFetchFiles({ column, id }) {
  return useQuery("files", () => fetchAllFiles(column, id));
}
