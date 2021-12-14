import { XIcon } from "@heroicons/react/outline";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dropdown } from "../../../common/Dropdown";

import { useRatesStore } from "../Rates/store";
import { numberFormat } from "../../../utils";
import { ConfirmationDialog } from "../../../common/Confirmation/Confirmation";
import { Button } from "../../../common";

const typeOptions = [
  { value: "Scaffolding", label: "Scaffolding" },
  { value: "Stairs", label: "Stairs" },
  { value: "Roof", label: "Roof" },
  { value: "Propping", label: "Propping" },
  { value: "Edge Protection", label: "Edge Protection" },
  { value: "Shrinkwrap", label: "Shrinkwrap" },
  { value: "Geda 1200", label: "Geda 1200" },
];

export function Line({
  zoneOptions,
  zoneLabels,
  quoteLine,
  handleRemove,
  index,
  handleProductLineChange,
  handleDimensionsLineChange,
  rates,
}) {
  const [transportVal, setTransportVal] = useState(quoteLine.transport || null);
  const [label, setLabel] = useState("");
  const [zone, setZone] = useState(!quoteLine?.zone);
  const [serviceType, setServiceType] = useState(null);

  const { lengthMeasurement, height, width, duration, transport } = quoteLine;
  useEffect(() => {
    setServiceType(quoteLine?.type);
  }, [quoteLine]);

  useEffect(() => {
    const rateData = rates.find((rate) => rate.service === serviceType);
    handleDimensionsLineChange(
      index,
      lengthMeasurement,
      height,
      width,
      duration,
      rateData,
      transportVal,
    );
  }, [lengthMeasurement, height, width, duration, transport]);

  useEffect(() => {
    if (lengthMeasurement && height && width) {
      if (transportVal !== 0 && !transportVal > 0) {


        const rateData = rates.find((rate) => rate.service === "Transport");
        const totalDimensions = Number(lengthMeasurement * height * width);

        const transportCost = Math.ceil(totalDimensions / 150) * Number(rateData?.erect_fee);
        setTransportVal(transportCost);
      }
    }
  }, [lengthMeasurement, height, width]);

  useEffect(() => {
    const findLabel = zoneLabels.find((el) => Number(el.id) === Number(quoteLine.zone));

    setLabel(findLabel?.label);

    handleProductLineChange(index, "zoneLabel", findLabel?.label);
  }, [quoteLine.zone]);

  // const handleTransportValueChange = (value) => {
  //
  //   setTransportVal(value || 0);
  //   const rateData = rates.find((rate) => rate.service === serviceType);
  //   handleDimensionsLineChange(
  //     index,
  //     lengthMeasurement,
  //     height,
  //     width,
  //     duration,
  //     rateData,
  //     transport,
  //   );
  // };

  return (
    <tr key={index}>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-20">
        <Dropdown
          hasLabel={false}
          options={zoneOptions}
          id={`zone${index}`}
          value={quoteLine.zone}
          onChange={(e) => {
            setZone(false);
            handleProductLineChange(index, "zone", e);
          }}
          repeatingForm
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-40">
        <input
          id={`zoneLabel${index}`}
          type="text"
          className="h-7 text-sm rounded-md w-full border border-gray-100 text-gray-600 focus:outline-none"
          value={label}
          name="zoneLabel"
          disabled
          onChange={(e) => handleProductLineChange(index, "zoneLabel", e.target.value)}
        />
      </td>
      <td className="h-6 px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-52">
        <Dropdown
          hasLabel={false}
          options={typeOptions}
          id={`type${index}`}
          value={quoteLine.type}
          disabled={zone}
          onChange={(e) => {
            setServiceType(e);
            handleProductLineChange(index, "type", e);
          }}
          repeatingForm
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-48">
        <input
          id={`description${index}`}
          type="text"
          className="h-7 text-sm rounded-md  w-full border border-gray-300 text-gray-900 focus:outline-none"
          value={quoteLine.description}
          onChange={(e) => handleProductLineChange(index, "description", e.target.value)}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-24">
        <input
          id={`lengthMeasurement${index}`}
          type="number"
          className="h-7 text-sm rounded-md  w-full border border-gray-300 text-gray-900 focus:outline-none"
          value={quoteLine.lengthMeasurement}
          disabled={!serviceType}
          onChange={(e) => handleProductLineChange(index, "lengthMeasurement", e.target.value)}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-24">
        <input
          id={`height${index}`}
          type="number"
          className="h-7 text-sm rounded-md w-full border border-gray-300 text-gray-900 focus:outline-none"
          value={quoteLine.height}
          disabled={!serviceType}
          onChange={(e) => handleProductLineChange(index, "height", e.target.value)}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-24">
        <input
          id={`width${index}`}
          type="number"
          className="h-7 text-sm rounded-md w-full border border-gray-300 text-gray-900 focus:outline-none"
          value={quoteLine.width}
          disabled={!serviceType}
          onChange={(e) => handleProductLineChange(index, "width", e.target.value)}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-32">
        <input
          id={`totalDimensions${index}`}
          type="text"
          className="h-7 text-sm rounded-md w-full border border-gray-100 text-gray-600 focus:outline-none"
          value={quoteLine.lengthMeasurement * quoteLine?.height * quoteLine?.width}
          onChange={(e) => handleProductLineChange(index, "totalDimensions", e.target.value)}
          disabled
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-32">
        <input
          id={`duration${index}`}
          type="text"
          className="h-7 text-sm rounded-md w-full border border-gray-300 text-gray-900 focus:outline-none"
          value={quoteLine.duration}
          disabled={!serviceType}
          onChange={(e) => handleProductLineChange(index, "duration", e.target.value)}
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-32">
        <input
          id={`transport${index}`}
          type="text"
          className="h-7 text-sm rounded-md w-full border border-gray-300 text-gray-900 focus:outline-none"
          value={transportVal || quoteLine.transport}
          disabled={!serviceType}
          onChange={(e) => {
            setTransportVal(e.target.value);
            // handleTransportValueChange(e.target.value);
            handleProductLineChange(index, "transport", e.target.value);
          }}
          // disabled
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-32">
        <input
          id={`dismantle${index}`}
          type="text"
          className="h-7 text-sm rounded-md w-full border border-gray-100 text-gray-600 focus:outline-none"
          value={numberFormat.format(quoteLine.dismantle)}
          onChange={(e) => handleProductLineChange(index, "dismantle", e.target.value)}
          disabled
        />
      </td>
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-32">
        <input
          id={`hireFee${index}`}
          type="text"
          className="h-7 text-sm rounded-md w-full border border-gray-100 text-gray-600 focus:outline-none"
          value={numberFormat.format(quoteLine.hireFee)}
          onChange={(e) => handleProductLineChange(index, "hireFee", e.target.value)}
          disabled
        />
      </td>
      {/*
          Total Amount Calc:
            * Erect and Dismantle Calc + Weekly Hire Fee Calc
        */}
      <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-32">
        <input
          id={`total${index}`}
          type="text"
          className="h-7 text-sm rounded-md w-full border border-gray-100 text-gray-500 focus:outline-none"
          value={numberFormat.format(Number(quoteLine.total))}
          onChange={(e) => handleProductLineChange(index, "total", e.target.value)}
          disabled
        />
      </td>
      <td className="px-2 py-1 text-tiny bg-white border border-gray-100 whitespace-nowrap w-8">
        <ConfirmationDialog
          icon="danger"
          title="Delete Line Item"
          body="Are you sure you want to delete this item? This action is unrecoverable!"
          triggerButton={
            <button type="button">
              <XIcon className="flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
            </button>
          }
          confirmButton={
            <Button
              variant="danger"
              className="bg-red-600 text-white"
              onClick={async (e) => {
                e.preventDefault();
                handleRemove(index, quoteLine.id);
              }}
            >
              Delete Line
            </Button>
          }
        />
      </td>
    </tr>
  );
}
