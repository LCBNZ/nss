import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PencilAltIcon, FolderOpenIcon } from "@heroicons/react/solid";

import { CreateVisit } from "../../components/Visits";
import { PageHeading, Table, Badge, Spinner } from "../../common";
import { columns } from "./columns";
import { VisitsApi } from "../../api";

import { formatDate } from "../../utils";

// export { JobDetails } from "./Details";
export { EditVisitForm } from "./EditVisit";

export const VisitsMain = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const visitsQuery = VisitsApi.useVisits();

  if (visitsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!visitsQuery.data) return null;

  return (
    <>
      <PageHeading title="Visits" createBtn="Create Visit" isEditable={false} setOpen={setOpen} />
      <Table
        cols={[
          {
            Header: "Date",
            accessor: "date",
          },
          {
            Header: "Job # (Details)",
            accessor: "jobs",
            Cell: ({ value }) => {
              const jobId = value.id + 1000;
              return (
                <Link key={`details${value.id}`} to={`jobs/${value.id}/details`}>
                  <div className="flex items-center">
                    <FolderOpenIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="hover:text-gray-800">#{jobId}</span>
                  </div>

                  <div>{value.site}</div>
                </Link>
              );
            },
          },
          {
            Header: "Team Leader",
            accessor: "staff.staff_name",
          },
          {
            Header: "Staff",
            accessor: "staff_labels",
            Cell: ({ value }) => {
              if (value && value?.length > 1) return value.map((task, index) => <div>{task}</div>);
              return value;
            },
          },
          {
            Header: "Vehicles",
            accessor: "vehicle_labels",
            Cell: ({ value }) => {
              if (value && value?.length > 1) return value.map((task, index) => <div>{task}</div>);
              return value;
            },
          },
          {
            Header: "Tasks",
            accessor: "task_labels",
            Cell: ({ value }) => {
              if (value && value?.length > 1) {
                return value.map((task, index) => (
                  <div>
                    {index + 1}. {task}
                  </div>
                ));
              }
              return value;
            },
          },
          {
            Header: "Notes",
            accessor: "notes",
          },
          {
            Header: "Risk",
            accessor: "risk",
            Cell: ({ row }) => {
              const type = row?.original?.risk;
              return <Badge type={type} text={type} />;
            },
            width: 60,
          },
          {
            Header: "Type",
            accessor: "type",
          },

          {
            Header: "SWMS / Task Analysis",
            accessor: "swms_document",
            width: 100,
          },
          {
            Header: "Status",
            accessor: "visit_status",
          },
          {
            Header: "",
            Cell: ({ row }) => {
              const type = row?.original?.status;
              return <Badge type={type} text={type} />;
            },
            width: 60,
            accessor: "status",
          },
          {
            Header: "Edit",
            Cell: ({ row }) => {
              const id = row?.original?.id;
              return (
                <Link
                  to={{
                    pathname: `visits/${id}/editVisit`,
                    state: { background: location, name: "editVisit" },
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
        tableData={visitsQuery.data}
        searchPlaceholder="Search Visits"
      />
      <CreateVisit open={open} setOpen={setOpen} />
    </>
  );
};
