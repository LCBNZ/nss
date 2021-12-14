import { useMutation, useQueryClient } from "react-query";
import supabase from "../../supabase";

import { formatQuoteLines, formatZones, formatAddons, formatRates } from "../../../utils";

import { createLines, createAddons, createZones, createRates } from "../index";
import { useNotificationStore } from "../../../store/notifications";

export async function duplicate(quote) {
  const num = getQuoteNum(quote.quote_num)

  const quoteNum = await supabase.from("quotes").select("*").like("quote_num", `${num}%`);
  const quoteLength = quoteNum?.data?.length;
  const nextVersionNumber = quoteLength ? quoteLength + 1 : 0;

  const { data, error } = await supabase.from("quotes").insert({
    quote_num: generateDuplicateQuoteNum(quote.quote_num, nextVersionNumber),
    version: nextVersionNumber + 1,
    client: quote.client,
    contact_id: quote.contact_id,
    estimator: quote.estimator,
    created_by: quote.created_by,
    max_zones: quote.max_zones,
    description: quote.description,
    street_1: quote.street_1,
    street_2: quote.street_2,
    city: quote.city,
    post_code: quote.post_code,
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

export function useDuplicate(quote) {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation(() => duplicate(quote), {
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
    mutationFn: duplicate,
  });
}

function generateDuplicateQuoteNum(num, version) {
  return `${num.split("-")[0]}-${version}`;
}

function getQuoteNum(num) {
  return num.split("-")[0]
}

