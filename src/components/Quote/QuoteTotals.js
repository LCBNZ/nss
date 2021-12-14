import React, { useEffect, useState } from "react";
import { numberFormat } from "../../utils";

import { Input } from "../../common";

export function Totals({ total, weekTotal, transportTotal }) {
  return (
    <div className="w-2/5">
      <h2 className="pl-4 text-lg leading-6 font-sm uppercase text-gray-700 my-4">Totals</h2>
      <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Total Transport Amount</dt>
          <dd className="text-sm font-medium text-gray-900">
            {numberFormat.format(transportTotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm">Total Weekly Amount</dt>
          <dd className="text-sm font-medium text-gray-900">{numberFormat.format(weekTotal)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <dt className="text-base font-medium">Total Amount</dt>
          <dd className="text-base font-medium text-gray-900">{numberFormat.format(total)}</dd>
        </div>
      </dl>
    </div>
  );
}
