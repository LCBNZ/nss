import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  XIcon,
  CheckIcon,
  PencilAltIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  DuplicateIcon,
  ClipboardCopyIcon,
} from "@heroicons/react/solid";

import { CreateJob } from "../../components/Jobs";
import { PageHeading, Table, Badge } from "../../common";
import { columns } from "./utils";
import { useJobs, useCreateJob } from "../../api/Jobs";

import { formatDate, SelectColumnFilter } from "../../utils";

export { JobDetails } from "./Details";
export { EditJob } from "./Edit";

export const JobsMain = () => {
  const location = useLocation();
  console.log("LOCATION", location);
  const [open, setOpen] = useState(false);
  const { status, data, error, isFetching } = useJobs();
  return (
    <div>
      <PageHeading title="Jobs" createBtn="Create Job" isEditable={false} setOpen={setOpen} />
      {status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <Table
            cols={[
              {
                Header: "Job # (Details)",
                accessor: "id",
                Cell: ({ value }) => {
                  const jobId = value;
                  return (
                    <Link
                      key={`details${jobId}`}
                      to={`jobs/${jobId}/details`}
                      className="flex items-center"
                    >
                      <FolderOpenIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="hover:text-gray-800">#{jobId + 1000}</span>
                    </Link>
                  );
                },
              },
              {
                Header: "Client",
                accessor: "clients.client_name",
              },
              {
                Header: "Site Address",
                accessor: "site",
              },
              {
                Header: "Start Date",
                accessor: "start_date",
                Cell: ({ value }) => (value ? formatDate(value) : ""),
              },
              {
                Header: "End Date",
                accessor: "end_date",
                Cell: ({ value }) => (value ? formatDate(value) : ""),
              },
              {
                Header: "Staff",
                accessor: "staff_labels",
                Cell: ({ value }) => {
                  if (value && value?.length > 1)
                    return value.map((staff, index) => <div>{staff}</div>);
                  return value;
                },
              },
              {
                Header: "Job Status",
                width: 60,
                accessor: "job_status",
                Filter: SelectColumnFilter,
                filter: "includes",
                filterable: true,
              },
              {
                Header: "Status",
                Cell: ({ row }) => {
                  const type = row?.original?.status;
                  return <Badge type={type} text={type} />;
                },
                width: 60,
                accessor: "status",
                type: "status_field",
                Filter: SelectColumnFilter,
                filter: "includes",
                filterable: true,
              },
              {
                Header: "Edit",
                Cell: ({ row }) => {
                  const id = row?.original?.id;
                  return (
                    <Link
                      // to={{
                      //   pathname: `jobs/${id}/edit`,
                      //   state: { background: "/jobs", name: "editJob" },
                      // }}
                      to={{
                        pathname: `jobs/${id}/editJob`,
                        state: { background: location, name: "editJob" },
                      }}
                    >
                      <PencilAltIcon className="text-gray-600 h-4 w-4" />
                    </Link>
                  );
                },
                width: 10,
                accessor: "edit",
              },
            ]}
            tableData={data}
            searchPlaceholder="Search Jobs"
          />
          <CreateJob open={open} setOpen={setOpen} />
        </>
      )}
      <div>{isFetching ? "Background Updating..." : " "}</div>
    </div>
  );
};
