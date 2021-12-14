import React, { useEffect, useState } from "react";
import moment from "moment";
import clsx from "clsx";
import { Button, Table, Spinner, Badge } from "../../common";

import { LeaveApi } from "../../api";

export const LeaveTable = ({ staffId }) => {
  const leaveQuery = LeaveApi.useStaffLeave(staffId);

  if (leaveQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!leaveQuery.data) return null;

  return (
    <div className="w-full mx-auto mt-8">
      <div>
        <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">Leave</h2>

        <Table
          cols={[
            {
              Header: "Date Added",
              accessor: "created_at",
              Cell: ({ value }) => {
                const date = moment(value).format("DD/MM/YYYY");
                return date;
              },
            },
            {
              Header: "Staff",
              accessor: "staff.staff_name",
            },
            {
              Header: "Leave Type",
              accessor: "type",
            },
            {
              Header: "Start Date",
              accessor: "start_date",
            },
            {
              Header: "Finish Date",
              accessor: "end_date",
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
              Header: "Approved / Declined By",
              accessor: "approved_by",
            },
          ]}
          tableData={leaveQuery?.data}
          searchPlaceholder="Search Leave"
          displayPagination={leaveQuery?.data?.length}
        />
      </div>
    </div>
  );
};
