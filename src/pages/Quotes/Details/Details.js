import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchQuote } from "../../../api/Quotes";

import { TwoColumnDetails, Section } from "../../../common/Details";
import { Table } from "../../../components/Quote/Table";
import { quoteLinesColumns, quoteAddonColumns } from "../columns";

import { Spinner } from "../../../common";

import { numberFormat } from "../../../utils";

export const QuoteDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState([]);
  const [address, setAddress] = useState("");
  const { quoteId } = useParams(0);

  useEffect(async () => {
    const quoteData = await fetchQuote(quoteId);
    setQuote(quoteData);
    setIsLoading(false);

    const fields = [[quoteData.street_1], [quoteData.street_2], [quoteData.city]];
    setAddress(
      fields
        .map((part) => part.filter(Boolean).join(" "))
        .filter((str) => str.length)
        .join(", "),
    );
  }, [quoteId]);

  if (isLoading)
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div className="w-full mx-auto mt-8">
      <TwoColumnDetails
        heading="Quote Details"
        isEditable={quote.status === 'Approved' ? false : true}
        editBtn="Edit Quote"
        editLink={`/quotes/${quoteId}/edit`}
      >
        <Section title="Quote #" content={quote?.quote_num} />
        <Section title="Client" content={quote?.clients?.client_name} />
        <Section title="Quote Type" content={quote?.quote_type} />
        <Section
          title="Variation Job"
          content={`${quote?.jobs?.id + 1000 || ""} - ${quote?.jobs?.site || ""}`}
        />
        <Section title="Description" content={quote?.description} />
        <Section title="Zones" content={quote?.max_zones} />
        <Section title="Street Address" content={address} />
        <Section title="Estimator" content={quote?.staff?.staff_name} />
        <Section title="Status" content={quote?.status} />
      </TwoColumnDetails>
      <div>
        <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">Quote Lines</h2>
        {quote?.quote_lines && <Table cols={quoteLinesColumns} tableData={quote?.quote_lines} />}
      </div>
      <div>
        <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">
          Additional Items
        </h2>
        {quote?.quote_addons && <Table cols={quoteAddonColumns} tableData={quote?.quote_addons} />}
      </div>
      <Totals quote={quote} />
    </div>
  );
};

function Totals({ quote }) {
  return (
    <div className="w-2/5 px-6 my-12">
      <h2 className="pl-4 text-lg leading-6 font-sm uppercase text-gray-700 my-4">Totals</h2>
      <dl className="py-6 space-y-6 px-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Total Transport Amount</dt>
          <dd className="text-sm font-medium text-gray-900">
            {numberFormat.format(quote?.transport_total)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm">Total Weekly Amount</dt>
          <dd className="text-sm font-medium text-gray-900">
            {numberFormat.format(quote?.weekly_total)}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <dt className="text-base font-medium">Total Amount</dt>
          <dd className="text-base font-medium text-gray-900">
            {numberFormat.format(quote?.total_amount)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
