import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllAppFilesById({ column, fileType, id }) {
  const { data, error } = await supabase
    .from("app_entries")
    .select("*")
    .eq(column, Number(id))
    .eq("file_type", fileType)
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
async function fetchAllAppFiles() {
  const { data, error } = await supabase
    .from("app_entries")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useFetchAppFiles(data) {
  if (data?.column && data?.id) {
    return useQuery("app-entries", () => fetchAllAppFilesById(data));
  }
  return useQuery("app-entries", () => fetchAllAppFiles());
}
