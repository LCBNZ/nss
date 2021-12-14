/* eslint-disable no-unused-expressions */
import React, { useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters } from "react-table";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { classNames } from "../../utils";

export function Table({ tableData, cols }) {
  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(() => cols, []);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
  );

  return (
    <div className="w-full px-8 mx-auto bg-white rounded-sm overflow-y-auto relative">
      <table
        {...getTableProps()}
        className="border-collapse table-auto w-full overflow-x-auto whitespace-no-wrap bg-white table-striped relative"
      >
        <thead className="bg-gray-100 py-1">
          {headerGroups.map((headerGroup, idx) => (
            <tr key={`header${idx}`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx1) => (
                <th
                  key={idx1}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  scope="col"
                  className={`${
                    column.id === "selection"
                      ? "w-6"
                      : column.id === "options"
                      ? "w-12 text-center mx-auto "
                      : ""
                  } border border-gray-100 px-4 py-2 text-left text-tiny font-medium text-blue-900 uppercase tracking-wider`}
                >
                  <span className="flex items-center text-tiny">
                    {column.render("Header")}

                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {rows.map((p) => {
            prepareRow(p);
            return (
              <tr key={p?.original?.id} {...p.getRowProps()}>
                {p.cells.map((cell, idx2) => (
                  <td
                    key={`cell${idx2}`}
                    {...cell.getCellProps({
                      style: {
                        width: cell.column.width,
                      },
                    })}
                    className={classNames(
                      cell.row.id % 2 === 1 ? "bg-gray-50" : "bg-white",
                      "px-4 py-1 text-sm whitespace-nowrap border border-gray-100",
                    )}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
