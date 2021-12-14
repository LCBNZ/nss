import { useQuery } from "react-query";

import supabase from "../../supabase";

async function getQuotes() {
  const { data, error } = await supabase
    .from("quotes")
    .select(
      `*,
        clients:client( id, client_name, phone, email),
        client_contacts (id, name, email, phone),
        staff:estimator(id, staff_name),
        quote_lines(*),
        quote_addons(*)
      `,
    )
    .order("quote_num", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export function useQuotes() {
    return useQuery({
      queryKey: ["quotes"],
      queryFn: () => getQuotes(),
    });
}
