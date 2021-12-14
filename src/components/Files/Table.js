import { useState } from "react";
import moment from "moment"
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { Table, Spinner, MoreOptions } from "../../common";
import { FilesApi } from "../../api";
import { CreateFile } from "./CreateFile";
import { DeleteFile } from "./DeleteFile";

export const FileList = ({ title, column, type, id }) => {
  const [open, setOpen] = useState(false);

  const dataQuery = FilesApi.useFetchFiles({
    column,
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
      <div className="px-8 py-2">
        <CreateFile column={column} type={type} id={id} setOpen={setOpen} />
      </div>
      <Table
        cols={[
          {
            Header: "Date Created",
            accessor: "created_at",
            Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
          },
          {
            Header: "File Type",
            accessor: "file_type",
          },
          {
            Header: "Job Name",
            accessor: "file_description",
          },
          {
            Header: "File",
            accessor: "file",
            Cell: ({ value }) => (
              <a href={value} target="_blank" rel="noreferrer">
                Link
              </a>
            ),
          },
          {
            Header: "Edit",
            accessor: "edit",
            Cell: () => (
              <button type="button">
                <PencilAltIcon className="text-gray-600 h-4 w-4" />
              </button>
            ),
            width: 60,
          },
          {
            Header: "Delete",
            accessor: "delete",
            Cell: ({ row }) => <DeleteFile fileId={row.original.id} />,
            width: 60,
          },
        ]}
        tableData={dataQuery.data}
        searchPlaceholder="Search Files"
        displayPagination={dataQuery?.data?.length}
      />
    </div>
  );
};
