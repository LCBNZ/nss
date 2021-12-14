import React, { useEffect, useState } from "react";
import { Table } from "../../../common";

export const JobFiles = ({ files }) => {

  return (
    <div className="w-full mx-auto mt-8">
      <div>
        <h2 className="text-lg px-8 mb-2 leading-6 font-large text-gray-900 mt-6">Job Tasks</h2>
        <Table
          cols={[
            {
              Header: "Created At",
              accessor: "created",
            },
            {
              Header: "File Type",
              accessor: "file_type",
            },
            {
              Header: "File Description",
              accessor: "description",
            },
            {
              Header: "File",
              accessor: "link",
            },
            {
              Header: "Created By",
              accessor: "created_by",
            },
          ]}
          tableData={[]}
        />
      </div>
    </div>
  );
};
