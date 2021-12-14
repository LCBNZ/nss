import React, { useState } from "react";
import Select from "react-select";
import clsx from "clsx";

import { ExclamationCircleIcon } from "@heroicons/react/solid";

export function Multiselect({
  label,
  id,
  hasLabel = true,
  isLoading,
  options,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
}) {
  return (
    <div className={clsx("w-full px-4 py-4")}>
      {" "}
      <label id={id} htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <Select
        id={id}
        isMulti
        isLoading={isLoading}
        isDisabled={isLoading || disabled}
        options={options}
        onBlur={() => onBlur(id, true)}
        onChange={(val) => onChange(id, val.value)}
        value={options.filter((option) => option.value === value)}
        className="text-xs basic-multi-select -py-4"
      />
      {error && (
        <div className="flex items-center">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
