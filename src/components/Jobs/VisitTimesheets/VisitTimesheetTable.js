import React, { useEffect, useState } from "react";
import moment from 'moment'
import { Button, Table, Spinner, Badge } from "../../../common";

import { JobsApi } from "../../../api";

export const VisitTimesheetTable = ({ jobId }) => {
  const timesheetsQuery = JobsApi.useFetchVisitTimesheets(jobId)

  if (timesheetsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!timesheetsQuery.data) return null;

  return (
    <div className="w-full mx-auto mt-8">
      <div>
        <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">
          Visit Timesheets
        </h2>

        <Table
          cols={[
            {
              Header: "Date",
              accessor: "visits.date",
            },
            {
              Header: "Time In",
              accessor: "time_in",
            },
            {
              Header: "Time Off",
              accessor: "time_off",
            },
            {
              Header: "Total Hours",
              accessor: "hours",
              Cell: ({ row }) => {
                const start = moment(row.original.time_in, "HH:mm");
                const finish = moment(row.original.time_off, "HH:mm");

                if (row.original.time_off && finish) {
                  const duration = moment.duration(finish.diff(start));
                  const hours = duration.asHours();
                  return hours.toFixed(2);
                }
                return "";
              },
            },
            // {
            //   Header: "Status",
            //   Cell: ({ row }) => {
            //     const type = row?.original?.status;
            //     return <Badge type={type} text={type} />;
            //   },
            //   width: 60,
            //   accessor: "status",
            // },
          ]}
          tableData={timesheetsQuery?.data}
          searchPlaceholder="Search Timesheets"
          displayPagination={timesheetsQuery?.data?.length}
        />
      </div>
    </div>
  );
};
