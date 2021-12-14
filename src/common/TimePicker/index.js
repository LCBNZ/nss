import moment from "moment";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

import { ExclamationCircleIcon } from "@heroicons/react/solid";

import "react-datepicker/dist/react-datepicker.css";

export function TimeSelect({ title, id, value, onChange, intervals = 15, error }) {
  return (
    <div className="w-full px-4 py-4">
      <label htmlFor="datePicker" className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <DatePicker
        selected={value ? new Date(value) : ""}
        onChange={(val) => onChange(id, moment(val).format("HH:mm"))}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={intervals}
        timeCaption="Time"
        dateFormat="HH:mm"
        className="text-xs border-gray-300 rounded-md shadow-sm"
      />
      {/* {error && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
        </div>
      )} */}
      {error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
}
