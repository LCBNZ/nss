import React, { useEffect, useState } from "react";
import moment from "moment";
import clsx from 'clsx'
import { Button, Table, Spinner, Badge } from "../../common";

import { JobsApi } from "../../api";

export const TagTable = ({ jobId }) => {
  const tagsQuery = JobsApi.useFetchJobTags(jobId);

  if (tagsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tagsQuery.data) return null;

  return (
    <div className="w-full mx-auto mt-8">
      <div>
        <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">Scaffold Tags</h2>

        <Table
          cols={[
            {
              Header: "Tag # (Details)",
              accessor: "tag_no",
            },
            {
              Header: "Description",
              accessor: "description",
            },
            {
              Header: "Last Inspection",
              accessor: "last_inspection",
            },
            {
              Header: "Inspection Due",
              accessor: "inspection_due",
              Cell: ({ value }) => {
                const date = moment(value, "DD/MM/YYYY");
                const isNextWeek = date.diff(moment(), "days");
                return (
                  <span
                    className={clsx(
                      isNextWeek <= 0 ? "text-red-500" : "",
                      isNextWeek > 0 && isNextWeek < 8 ? "text-yellow-500" : "",
                      "font-semibold text-center",
                    )}
                  >
                    {value}
                  </span>
                );
              },
            },
            {
              Header: "Status",
              accessor: "status",
              Cell: ({ row }) => {
                const type = row?.original?.status;
                return <Badge type={type} text={type} />;
              },
            },
          ]}
          tableData={tagsQuery?.data}
          searchPlaceholder="Search Scaffold Tags"
          displayPagination={tagsQuery?.data?.length}
        />
      </div>
    </div>
  );
};
