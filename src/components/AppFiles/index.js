import { useState } from "react";
import moment from "moment";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { Table, Spinner, MoreOptions } from "../../common";
import { FilesApi } from "../../api";

export const AppFileList = ({ title, column, fileType, type, id }) => {
  const dataQuery = FilesApi.useFetchAppFiles({
    column,
    fileType,
    id,
  });

  if (dataQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!dataQuery.data) return null;

  return (
    <div className="w-full">
      <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">{title}</h2>
      <Table
        cols={[
          {
            Header: "Date Uploaded",
            accessor: "created_at",
            Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
          },
          {
            Header: "File Type",
            accessor: "file_type",
          },
          {
            Header: "File",
            accessor: "link",
            Cell: ({ value }) => (
              <a href={value} target="_blank" rel="noreferrer">
                Link
              </a>
            ),
          },
          ...column === "vehicle_id" ? [{
            Header: "Corrective Actions",
            accessor: "corrective_actions",
          }] : [],
          {
            Header: "Uploaded By",
            accessor: "uploaded_by",
          },
        ]}
        tableData={dataQuery.data}
        searchPlaceholder="Search Files"
        displayPagination={dataQuery?.data?.length}
      />
    </div>
  );
};
