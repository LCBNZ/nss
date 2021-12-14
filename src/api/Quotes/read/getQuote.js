import { useQuery } from "react-query";
import supabase from "../../supabase";

export async function fetchQuote(id) {
  const { data, error } = await supabase
    .from("quotes")
    .select(
      `*,
      clients:client(id, client_name),
      client_contacts(*),
      quote_lines(*),
      quote_zones(*),
      quote_addons(*),
      quote_rates(*),
      staff:estimator(*),
      jobs:variation_job_id(id, site)
      `,
    )
    .eq("id", Number(id));
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export function useFetchQuote(quoteId) {
    return useQuery({
      queryKey: ["quote", quoteId],
      queryFn: () => fetchQuote(quoteId),
    });
}
