import { useState } from "react";
import moment from "moment";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { Table, Spinner, MoreOptions } from "../../common";
import { NotesApi } from "../../api";
import { CreateNote } from "./CreateNote";

export const NoteList = ({ title, column, type, id }) => {
  const [open, setOpen] = useState(false);

  const dataQuery = NotesApi.useFetchNotes({
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
    <div className="w-full mb-28">
      <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">{title}</h2>
      <div className="px-8 py-2">
        <CreateNote column={column} type={type} id={id} setOpen={setOpen} />
      </div>
      <Table
        cols={[
          {
            Header: "Date Created",
            accessor: "created_at",
            width: 60,
            Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
          },
          {
            Header: "Notes",
            accessor: "notes",
          },
        ]}
        tableData={dataQuery.data}
        searchPlaceholder="Search Notes"
        displayPagination={dataQuery?.data?.length}
      />
    </div>
  );
};
