import React, { useState } from "react";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import { FolderOpenIcon, PencilAltIcon } from "@heroicons/react/solid";
import { PageHeading, Table, Badge, Spinner } from "../../common";
import { TimesheetsApi } from "../../api";

export const ApprovedTimesheetMain = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const timesheetsQuery = TimesheetsApi.useTimesheets("Approved");

  if (timesheetsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeading title="Approved Timesheet" isEditable={false} setOpen={setOpen} />
      <>
        <Table
          cols={[
            {
              Header: "Staff",
              accessor: "staff.staff_name",
            },
            {
              Header: "Date",
              accessor: "date",
            },
            // {
            //   Header: "Job",
            //   accessor: "job.site",
            //   Cell: ({ row }) => `${row?.original?.job?.id + 1000} - ${row.original?.job?.site}`,
            // },
            {
              Header: "Time On",
              accessor: "time_on",
            },
            {
              Header: "Time Off",
              accessor: "time_off",
            },
            {
              Header: "Total Hours",
              accessor: "hours",
              Cell: ({ row }) => {
                const start = moment(row.original.time_on, "HH:mm");
                const finish = moment(row.original.time_off, "HH:mm");

                const duration = moment.duration(finish.diff(start));
                const hours = duration.asHours();
                return hours.toFixed(2);
              },
            },
            {
              Header: "Comments",
              accessor: "comments",
            },
            {
              Header: "Status",
              accessor: "status",
              Cell: ({ row }) => {
                const type = row?.original?.status;
                return <Badge type={type} text={type} />;
              },
            },
            {
              Header: "Approved By",
              accessor: "approved_by",
            },
          ]}
          tableData={timesheetsQuery.data}
          searchPlaceholder="Search Timesheets"
        />
      </>
    </div>
  );
};
