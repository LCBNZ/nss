import supabase from "../supabase";

export async function fetchClient(id) {
  const { data, error } = await supabase.from("client_contacts").select("*").eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}
