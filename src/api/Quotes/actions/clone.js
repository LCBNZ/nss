import { useMutation, useQueryClient } from "react-query";
import supabase from "../../supabase";

import { formatQuoteLines, formatZones, formatAddons, formatRates } from "../../../utils";

import { createLines, createAddons, createZones, createRates } from "../index";
import { useNotificationStore } from "../../../store/notifications";

import { getQuoteNum } from "../read/getQuoteNum";

export async function clone(quote) {
  const lastQuote = await getQuoteNum();
  const lastQuoteNum = lastQuote?.quote_num?.split("-")?.[0];
  const nextNumSeq = lastQuoteNum ? Number(lastQuoteNum) + 1 : 1000;

  const { data, error } = await supabase.from("quotes").insert({
    quote_num: `${String(nextNumSeq)}-1`,
    version: 1,
    client: null,
    contact_id: null,
    estimator: quote.estimator,
    created_by: quote.created_by,
    max_zones: quote.max_zones,
    description: quote.description,
    street_1: null,
    street_2: null,
    city: null,
    post_code: null,
    terms: quote.terms,
    weekly_total: quote.weekly_total,
    total_amount: quote.total_amount,
    status: "Pending",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function useClone(quote) {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation(() => clone(quote), {
    onSuccess: async (payload) => {
      if (quote.quote_lines.length) {
        const formattedLines = formatQuoteLines(quote.quote_lines, payload?.[0].id);
        await createLines(formattedLines);
      }
      if (quote.quote_addons.length) {
        const formattedLines = formatAddons(quote.quote_addons, payload?.[0].id);
        await createAddons(formattedLines);
      }
      if (quote.quote_zones.length) {
        const formattedLines = formatZones(quote.quote_zones, payload?.[0].id);
        await createZones(formattedLines);
      }
      if (quote.quote_rates.length) {
        const formattedLines = formatRates(quote.quote_rates, payload?.[0].id);
        await createRates(formattedLines);
      }
      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: "Successfully duplicated quote!",
      });
      queryClient.refetchQueries("quotes");
    },
    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failure!",
        content: "Failed to duplicate quote. Please try again.",
      });
    },
    mutationFn: clone,
  });
}
