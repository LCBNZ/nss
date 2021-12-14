import React, { useState, useEffect } from "react";
import { XIcon, PlusIcon, CurrencyDollarIcon } from "@heroicons/react/outline";
import clsx from 'clsx'
import { Dropdown } from "../../../common/Dropdown";
import { numberFormat } from "../../../utils";

const typeOptions = [
  { value: "Standard Scaffolder rate", label: "Standard Scaffolder rate" },
  { value: "Non-standard scaffolder rate", label: "Non-standard scaffolder rate" },
  { value: "Small Truck (Variation Works)", label: "Small Truck (Variation Works)" },
  { value: "Hiab Truck (Variation Works)", label: "Hiab Truck (Variation Works)" },
];

export function AdditionalLine({
  line,
  index,
  handleLineChange,
  handleRemoveLine,
  handleDimensionsLineChange,
  rates,
}) {
  const [serviceType, setServiceType] = useState(null);
  const { type, duration, hireFee, fixedCharge } = line;
  // console.log("LINE >>> ", line)
  useEffect(() => {
    console.log("LINE >>> ", line)
    setServiceType(line?.type);
  }, [line]);

  useEffect(() => {
    const rateData = rates.find((rate) => rate.service === serviceType);
    console.log("SELECTED RATE", rateData);
    if (duration || fixedCharge) {
      handleDimensionsLineChange(index, duration, hireFee, fixedCharge, type, rateData);
    }
  }, [type, duration, hireFee, fixedCharge, serviceType]);

  return (
    <tr key={index}>
      <td className="h-6 px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-52">
        <Dropdown
          hasLabel={false}
          options={typeOptions}
          id={`type${index}`}
          value={line.type}
          onChange={(e) => {
            setServiceType(e);
            handleLineChange(index, "type", e);
          }}
          repeatingForm
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap">
        <input
          id={`description${index}`}
          type="text"
          className="h-7 rounded-md w-full border border-gray-300 text-gray-900 focus:outline-none"
          name="description"
          value={line.description}
          onChange={(e) => handleLineChange(index, "description", e.target.value)}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-40">
        <input
          id={`duration${index}`}
          type="number"
          className="h-7 rounded-md w-full border border-gray-300 text-gray-900 focus:outline-none"
          name="duration"
          value={line.duration}
          onChange={(e) => handleLineChange(index, "duration", e.target.value)}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-40">
        <input
          id={`hireFee${index}`}
          type="number"
          className={clsx(
            type ? "border border-gray-100" : "border border-gray-300",
            "h-7 rounded-md w-full text-gray-900 focus:outline-none",
          )}
          name="hireFee"
          value={line.hireFee}
          onChange={(e) => handleLineChange(index, "hireFee", e.target.value)}
          disabled={type}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-40">
        <input
          id={`fixedCharge${index}`}
          type="number"
          className={clsx(
            type ? "border border-gray-100" : "border border-gray-300",
            "h-7 rounded-md w-full text-gray-900 focus:outline-none",
          )}
          name="fixedCharge"
          value={line.fixedCharge}
          onChange={(e) => handleLineChange(index, "fixedCharge", e.target.value)}
          disabled={type}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-40">
        <input
          id={`totalCost${index}`}
          type="text"
          className="h-7 rounded-md w-full border border-gray-300 text-gray-600 focus:outline-none"
          name="totalCost"
          disabled
          value={numberFormat.format(line.totalCost)}
        />
      </td>
      <td className="px-2 py-1 text-tiny bg-white border border-gray-100 whitespace-nowrap">
        <button type="button" onClick={() => handleRemoveLine(index, line.id)}>
          <XIcon className="flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
