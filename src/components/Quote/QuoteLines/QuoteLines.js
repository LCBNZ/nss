import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { Line } from "./Line";

import { Spinner } from "../../../common";
import { QuotesApi } from "../../../api";

import { useNotificationStore } from "../../../store/notifications";

const initialLine = {
  id: null,
  zone: "",
  zoneLabel: "",
  type: "",
  description: "",
  lengthMeasurement: "",
  height: "",
  width: "",
  totalDimensions: "",
  duration: 0,
  transport: 0,
  dismantle: "",
  hireFee: "",
  total: 0,
};

export const QuoteLines = ({
  quoteLines,
  setQuoteLines,
  zoneOptions,
  zoneLabels,
  rates,
  formType,
}) => {
  const deleteQuoteLineMutation = QuotesApi.useDeleteLine();
  const { addNotification } = useNotificationStore();
  // Recalculate values on rate change

  useEffect(() => {
    let isCurrent = true;
    if (isCurrent) {
      const update = quoteLines.map((line) => {
        const rateData = rates.find((rate) => rate.service === line.type);
        const transportRate = rates.find((rate) => rate.service === "Transport");
        const totalDimensions = Number(line.totalDimensions);
        const duration = Number(line.duration);
        // E & D = Service Type[Erect & Dismantle Fee] * Total Dimensions
        const erectDismantleFee = Number(rateData?.erect_fee) * totalDimensions;

        // Week Hire Fee = Service Type[Hire Fee] * Total Dimensions
        const weekHireFee = Number(rateData?.hire_fee) * totalDimensions;
        // Number(rateData?.hire_fee) * totalDimensions * duration;
        const totalWeekFee = Number(rateData?.hire_fee) * totalDimensions * duration;
        const transportCost = Number(line.transport);
        const total = erectDismantleFee + totalWeekFee + transportCost;
        console.log("erectDismantleFee", erectDismantleFee);
        if(line.description === 'Scaff A') console.log("TOTAL >>>> ", total);
        return {
          ...line,
          dismantle: erectDismantleFee,
          hireFee: weekHireFee,
          transport: Math.ceil(transportCost),
          total,
        };

      });
      // console.log("UPDATE", update);
      setQuoteLines(update);
      console.log("UPDATE", update)
    }
    return () => {
      isCurrent = false;
    };
  }, [rates]);

  const handleAddLine = () => {
    setQuoteLines([...quoteLines, initialLine]);
  };

  const handleRemoveLine = async (id, quoteId) => {
    setQuoteLines(quoteLines.filter((line, index) => index !== id));

    // If form type is edit, send an api call to delete line by id.
    if (formType === "edit") {
      console.log("DELETING LINES", quoteId);
      try {
        await deleteQuoteLineMutation.mutateAsync(quoteId);

        addNotification({
          isSuccess: true,
          heading: "Success!",
          content: `Successfully remove quote line`,
        });
      } catch (err) {
        console.log("ERROR DELETING", err);

        addNotification({
          isSuccess: false,
          heading: "Failed!",
          content: `Failed to remove quote line`,
        });
      }
    }
  };

  const handleDimensionsLineChange = (
    index,
    length,
    height,
    width,
    duration,
    rateData,
    transport,
  ) => {
    if (length && height && width) {
      // const transportRate = rates.find((rate) => rate.service === "Transport");
      // Total Dimensions = (Length * Height) * Width
      const totalDimensions = Number(length * height * width);
      // E & D = Service Type[Erect & Dismantle Fee] * Total Dimensions
      const erectDismantleFee = Number(rateData?.erect_fee) * totalDimensions;

      // Week Hire Fee = Service Type[Hire Fee] * Total Dimensions
      const weekHireFee = Number(rateData?.hire_fee) * totalDimensions;
      // Number(rateData?.hire_fee) * totalDimensions * duration;
      const totalWeekFee = Number(rateData?.hire_fee) * totalDimensions * duration;
      const transportCost = Number(transport);
      const total = erectDismantleFee + totalWeekFee + Number(transport);

      setQuoteLines(
        quoteLines.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              totalDimensions,
              dismantle: erectDismantleFee,
              hireFee: weekHireFee,
              transport: transportCost,
              total,
            };
          }
          return item;
        }),
      );
    }
  };

  const handleProductLineChange = (index, name, value) => {
    setQuoteLines(
      quoteLines.map((item, i) => {
        if (i === index) {
          return { ...item, [name]: value };
        }
        return item;
      }),
    );
  };

  const columns = [
    "Zones",
    "Zone Label",
    "Type",
    "Description",
    "Length",
    "Height",
    "Width",
    "Total Dimensions",
    "Weekly Duration",
    "Transport",
    "Erect & Dismantle",
    "Weekly Hire Fee",
    "Total",
    "",
  ];

  return (
    <div>
      <div className="w-full">
        <h2 className="text-lg leading-6 font-sm uppercase text-gray-700 my-4">
          Scaffolding, Propping & Optional Extras
        </h2>
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
          <tbody className="bg-white divide-y divide-gray-200 w-8">
            {quoteLines.map((line, index) => (
              <Line
                quoteLine={line}
                handleRemove={handleRemoveLine}
                index={index}
                handleProductLineChange={handleProductLineChange}
                handleDimensionsLineChange={handleDimensionsLineChange}
                zoneOptions={zoneOptions}
                zoneLabels={zoneLabels}
                rates={rates}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 mb-16">
        <button type="button" className="flex items-center" onClick={handleAddLine}>
          <PlusIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
          <span className="ml-2 text-sm">Add Item</span>
        </button>
      </div>
    </div>
  );
};
