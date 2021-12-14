import React, { useState, useEffect } from "react";

import { useRatesStore } from "./store";

export const Rates = React.memo(({ data, setRates, user, handleChange }) => {
  const columns = ["Service", "Erect & Dismantle", "Hire"];

  // const { rates, setRates, updateRate } = useRatesStore();

  const updateRate = (id, name, value) => {
    setRates(data.map((rate) => (rate.id === id ? { ...rate, [name]: Number(value) } : rate)));
    handleChange(data.map((rate) => (rate.id === id ? { ...rate, [name]: Number(value) } : rate)));
  };
  // const handleTrigger = () => {
  //   handleChange();
  // };
  return (
    <>
      {data ? (
        <div className="w-full">
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
              {data.map((line, index) => (
                <tr key={index}>
                  <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-12">
                    <span>{line?.service}</span>
                  </td>
                  <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-12">
                    <input
                      id={`rateErect${line?.id}`}
                      type="number"
                      defaultValue={line?.erect_fee}
                      className="h-7 rounded-md w-full border border-gray-300 text-gray-900 focus:outline-none"
                      name="rateErect"
                      onChange={(e) => updateRate(line?.id, "erect_fee", e.target.value)}
                      disabled={
                        user.email === "shaun@nss.co.nz" ||
                        user.email === "clifton@nss.co.nz" ||
                        user.email === "ben@lcbnz.co.nz"
                          ? false
                          : true
                      }
                    />
                  </td>
                  <td className="px-2 py-1 text-sm bg-white border border-gray-100 whitespace-nowrap w-16">
                    <input
                      id={`rateHire${line?.id}`}
                      type="number"
                      defaultValue={line?.hire_fee}
                      className="h-7 rounded-md w-full border border-gray-300 text-gray-900 focus:outline-none"
                      name="rateHire"
                      onChange={(e) => updateRate(line?.id, "hire_fee", e.target.value)}
                      disabled={
                        user.email === "shaun@nss.co.nz" ||
                        user.email === "clifton@nss.co.nz" ||
                        user.email === "ben@lcbnz.co.nz"
                          ? false
                          : true
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
});
