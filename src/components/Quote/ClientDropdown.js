import React, { useState } from "react";
import { PlusCircleIcon , ExclamationCircleIcon } from "@heroicons/react/solid";
import Select from "react-select";
import clsx from "clsx";



const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "30px",
    height: "30px",
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "30px",
    padding: "0 6px",
  }),
  input: (provided, state) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: (state) => ({
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "30px",
  }),
};

export function ClientDropdown({
  label,
  id,
  repeatingForm = false,
  isMultiSelect,
  isLoading,
  options,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
}) {
  return (
    <div className="w-1/2">
      <div className={clsx("w-full px-4 py-4")}>
        {" "}
        <label id={id} htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
        <Select
          id={id}
          defaultValue={options.filter((option) => option?.email === value)} // option?.email === value
          isMulti={isMultiSelect}
          isLoading={isLoading}
          isDisabled={isLoading || disabled}
          options={options}
          onBlur={() => onBlur(id, true)}
          onChange={(val) => onChange(id, val.value)}
          value={options.filter((option) => option.value === value)}
          className="text-xs basic-multi-select -py-4"
          styles={repeatingForm && customStyles}
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
      <div className="flex items-center pl-4">
        <PlusCircleIcon className="w-6 h-6 text-indigo-500" />
        <button
          type="button"
          className="pl-1 font-semibold leading-5 text-sm text-gray-600 hover:text-gray-800"
          onClick={() => {
            // setClientForm(true)
          }}
        >
          Add new Client
        </button>
      </div>
    </div>
  );
}
