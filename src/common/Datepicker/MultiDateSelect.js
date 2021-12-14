import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export function DateSelect({ title, id, start, end, onChange }) {
  const [startDate, setStartDate] = React.useState(moment(start, 'DD/MM/YYYY').toDate() || null);
  const [endDate, setEndDate] = React.useState(moment(end, 'DD/MM/YYYY').toDate() || null);
  return (
    <>
      <DatePicker
        selected={startDate}
        onChange={(val) => onChange(id, val)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <DatePicker
        selected={endDate}
        onChange={(val) => onChange(id, val)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
    </>
  );
}
