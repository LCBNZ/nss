import React from "react";
import moment from 'moment';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export function DateSelect({ title, id, value, onChange }) {
  return (
    <div className="w-full px-4 py-4">
      <label htmlFor={id} id={`date${id}`} className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <DatePicker
        id={id}
        autoComplete="off"
        dateFormat="dd/MM/yyyy"
        selected={(value && moment(value, 'DD/MM/YYYY').toDate()) || null}
        onChange={(val) => onChange(id, val)}
        className="text-xs border-gray-300 rounded-md shadow-sm"
        // popperPlacement="bottom-end"
      />
    </div>
  );
}
