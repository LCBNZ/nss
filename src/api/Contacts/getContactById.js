import { useQuery } from "react-query";

import supabase from "../supbase";

async function getManyContacts() {
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export function useClients() {
  return useQuery("clients", () => getManyContacts());
}
