import React from "react";
import {
  ExclamationCircleIcon,
  MailIcon,
  PhoneIcon,
} from "@heroicons/react/solid";

import { classNames } from "../../../utils";

const iconDisplay = {
  email: <MailIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />,
  phone: <PhoneIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />,
};

export const Input = ({
  title,
  type,
  id,
  placeholder,
  labelInline = false,
  props,
  icon = "",
  handleChange,
  handleBlur,
  value,
  defaultValue,
  error,
}) => (
  <div
    className={classNames(
      labelInline ? "flex items-center  px-4 py-2" : "block px-4 py-4",
      "w-full",
    )}
  >
    <div>
      <label
        htmlFor={id}
        className={classNames(
          labelInline ? "mr-4 w-full" : "",
          "block text-sm font-medium text-gray-700",
        )}
      >
        {title}
      </label>
    </div>
    <div
      className={classNames(
        labelInline ? "w-full" : "",
        "relative mt-1 rounded-md shadow-sm sm:col-span-2",
      )}
    >
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {iconDisplay[icon]}
        </div>
      )}
      <input
        type="text"
        name={id}
        id={id}
        className={classNames(
          icon ? "pl-10" : "",
          error?.id
            ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            : "focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300",
          "w-full text-sm rounded-md",
        )}
        placeholder={placeholder}
        aria-invalid="true"
        aria-describedby="email-error"
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        defaultValue={defaultValue}
        // {...props}
      />
      {error && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ExclamationCircleIcon
            className="w-5 h-5 text-red-500"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
    {error && (
      <p className="mt-2 text-sm text-red-600" id="email-error">
        {error}
      </p>
    )}
  </div>
);
