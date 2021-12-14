import React, { useState, useEffect } from "react";
import { XIcon, PlusIcon } from "@heroicons/react/outline";

import { AdditionalLine } from "./AdditionalLine";

import { QuotesApi } from "../../../api";
import { useNotificationStore } from "../../../store/notifications";

const initialLine = {
  id: null,
  type: "",
  description: "",
  duration: "",
  hireFee: "",
  fixedCharge: "",
  totalCost: "",
};

export function AdditionalItems({ items, setItems, formType, rates }) {
  const deleteQuoteAddonMutation = QuotesApi.useDeleteAddon();
  const { addNotification } = useNotificationStore();

  const columns = [
    "Type",
    "Description",
    "Duration/Quantity",
    "Weekly Hire Fee/Charge",
    "Fixed Charge",
    "Total Cost",
    "",
  ];

  useEffect(() => {
    let isCurrent = true;
    if (isCurrent) {
      console.log("RATES UPDATED", rates);
      const update = items.map((line) => {
        const rateData = rates.find((rate) => rate.service === line.type);
        const erectFee = rateData?.erect_fee || 0;

        const duration = line?.duration || 0;
        const weekFee = line?.weeklyFee || 0;
        const fixedCharge = line?.fixedCharge || 0;

        let total = 0;
        if (line.type) {
          total = Number(erectFee) * Number(duration);
        } else {
          total = Number(duration) * Number(weekFee) + Number(fixedCharge);
        }
        console.log("UPDATED TOTAL >>>>>>> ", total)
        return {
          ...line,
          totalCost: total,
        };
      });
      setItems(update);
      console.log("UPDATE", update);
    }
    return () => {
      isCurrent = false;
    };
  }, [rates]);

  const handleAddLine = () => {
    setItems([...items, initialLine]);
  };

  const handleRemoveLine = async (id, addonId) => {
    setItems(items.filter((line, index) => index !== id));

    // If form type is edit, send an api call to delete line by id.
    if (formType === "edit") {
      try {
        await deleteQuoteAddonMutation.mutateAsync(addonId);

        addNotification({
          isSuccess: true,
          heading: "Success!",
          content: `Successfully remove quote addon`,
        });
      } catch (err) {
        addNotification({
          isSuccess: false,
          heading: "Failed!",
          content: `Failed to remove quote addon`,
        });
      }
    }
  };

  const handleLineChange = (index, name, value) => {
    setItems(
      items.map((item, i) => {
        if (i === index) {
          return { ...item, [name]: value };
        }
        return item;
      }),
    );
  };

  const handleDimensionsLineChange = (
    index,
    duration,
    weeklyFee = 0,
    fixedCharge,
    type,
    rateData,
  ) => {
    console.log("rateData >>> ", rateData);
    console.log("DURATION", duration);
    // const otherTotal = N;
    let total = 0;
    if (type) {
      total = Number(rateData?.erect_fee) * Number(duration);
    } else {
      total = Number(duration) * Number(weeklyFee) + Number(fixedCharge);
    }
    setItems(items.map((item, i) => (i === index ? { ...item, totalCost: total } : item)));
  };

  return (
    <div className="w-4/5 mb-8">
      <h2 className="text-lg leading-6 font-sm uppercase text-gray-700 my-4">Additional Items</h2>
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <>
                <th className="text-center border border-gray-200 px-1 py-2 text-left text-tiny font-medium text-blue-900 uppercase tracking-wider">
                  {column}
                </th>
              </>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((line, index) => (
            <AdditionalLine
              line={line}
              index={index}
              handleLineChange={handleLineChange}
              handleRemoveLine={handleRemoveLine}
              handleDimensionsLineChange={handleDimensionsLineChange}
              rates={rates}
            />
          ))}
        </tbody>
      </table>
      <div className="mt-6 mb-16">
        <button type="button" className="flex items-center" onClick={handleAddLine}>
          <PlusIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
          <span className="ml-2 text-sm">Add Item</span>
        </button>
      </div>
    </div>
  );
}
