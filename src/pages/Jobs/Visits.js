import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PencilAltIcon, FolderOpenIcon } from "@heroicons/react/solid";
import { PlusCircleIcon } from "@heroicons/react/outline";

import { CreateVisit, EditVisit } from "../../components/Visits";
import { PageHeading, Table, Badge, Spinner, Button } from "../../common";
import { VisitsApi } from "../../api";

export { EditVisitForm } from "../Visits/EditVisit";

export const VisitsMain = (jobId) => {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [openEditPage, setOpenEditPage] = useState(false);
  const [visitId, setVisitid] = useState(null);
  const visitsQuery = VisitsApi.useGetVisitsByJob(jobId);

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
      <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">Visits</h2>
      <div className="px-8 py-2">
        <Button
          type="button"
          variant="primary"
          onClick={() => setOpen(true)}
          startIcon={<PlusCircleIcon className="w-4 h-4" />}
        >
          Create Visit
        </Button>
      </div>
      <Table
        cols={[
          {
            Header: "Date",
            accessor: "date",
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
          // {
          //   Header: "Edit",
          //   Cell: ({ row }) => {
          //     const id = row?.original?.id;
          //     return (
          //       <button type="button" onClick={() => {
          //         setOpenEditPage(true);
          //         setVisitid(id);
          //       }}>
          //         <PencilAltIcon className="text-gray-600 h-4 w-4" />
          //       </button>
          //     );
          //   },
          //   width: 10,
          //   accessor: "edit",
          // },
        ]}
        tableData={visitsQuery.data}
        searchPlaceholder="Search Visits"
        displayPagination={visitsQuery?.data?.length}
      />
      <CreateVisit open={open} setOpen={setOpen} jobId={Number(jobId?.jobId) || null} />
    </>
  );
};
