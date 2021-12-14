/* eslint-disable no-unused-expressions */
import React, { useMemo } from "react";
import moment from "moment";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from "react-table";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid";

import { Search, Pagination, Checkbox, RecordsPerPage, Approve, Popover } from "./components";
import { ExportButton } from "../ExportButton";
import { classNames } from "../../utils";

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, openFilter, children }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <>
      <Popover
        value={value}
        setValue={setValue}
        onChange={onChange}
        children={children}
        openFilter={openFilter}
      />
    </>
  );
}

function DefaultColumnFilter({ column: { Header, filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <input
      className="py-2 h-full w-full border-gray-300 px-2 transition-all border-blue rounded-sm"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${Header}`}
    />
  );
}

export function Table({
  tableData,
  cols,
  searchPlaceholder,
  hasBulkSelect = false,
  approveText = "",
  ApproveBtn,
  isBasic = false,
  isExportable = false,
  displayPagination = true,
}) {
  const [openFilter, setOpenFilter] = React.useState(true);
  const data = useMemo(() => tableData, [tableData]);

  const filterTypes = React.useMemo(
    () => ({
      // dateBetween: dateBetweenFilterFn,
      dateBetween: (rows, id, filterValue) => {

        const start = moment(filterValue[0], 'DD/MM/YYY')
        const end = moment(filterValue[1], "DD/MM/YYY")


        let rowsResult
        if (filterValue[0] && filterValue[1]) {

          rowsResult = rows.filter((val) =>
            moment(val.original[id], "DD/MM/YYYY").isBetween(start, end),
          );

          setOpenFilter(false);
        } else {
          rowsResult = rows;
        }
        return rowsResult;
      },
      text: (rows, id, filterValue) =>
        rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        }),
    }),
    [],
  );

  const toDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month, day);
  };

  function dateBetweenFilterFn(rows, id, filterValues) {

    const sd = filterValues[0] ? toDate(filterValues[0]) : "";
    const ed = filterValues[1] ? toDate(filterValues[1]) : "";

    let dateRows;
    if (sd && ed) {

      dateRows = rows.filter((r) => {
        const time = new Date(r.values[id]);

        if (filterValues.length === 0) return rows;
        return time >= sd && time <= ed;
      });
    }
    return dateRows;
  }

  dateBetweenFilterFn.autoRemove = (val) => !val;

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const columns = useMemo(() => cols, []);
  const {
    getTableProps,
    getTableBodyProps,
    preGlobalFilteredRows,
    headerGroups,
    page,
    prepareRow,

    // PAGINATION
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    // FILTERING
    state,
    setAllFilters,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 25,
      },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  );
  return (
    // <form className="overflow-y-hidden">
    <div className="px-8 mx-auto">
      {/* {hasBulkSelect && <ApproveBtn />} */}
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center">
          <Search
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            placeholder={searchPlaceholder}
          />
          {isExportable && <ExportButton />}
        </div>
        {!isBasic && <RecordsPerPage state={state} setPageSize={setPageSize} />}
      </div>
      <div className="flex flex-col">
        {displayPagination ? (
          <Pagination
            state={state}
            pageOptions={pageOptions}
            previousPage={previousPage}
            canPreviousPage={canPreviousPage}
            nextPage={nextPage}
            canNextPage={canNextPage}
            setPageSize={setPageSize}
            gotoPage={gotoPage}
            pageCount={pageCount}
          />
        ) : (
          <span className="text-sm text-gray-800 py-2 mb-4">No results to display</span>
        )}
      </div>
      {/* <div>
        {state.filters.length > 0 && (
          <button type="button" onClick={() => setAllFilters([])}>
            Reset Filters
          </button>
        )}
      </div> */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="border-collapse w-full whitespace-no-wrap bg-white table-auto"
              >
                <thead className="bg-gray-100 py-1">
                  {headerGroups.map((headerGroup, idx) => (
                    <tr key={`header${idx}`} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, idx1) => (
                        <th
                          key={idx1}
                          scope="col"
                          className={`${
                            column.id === "selection"
                              ? "w-6"
                              : column.id === "options"
                              ? "w-12 text-center mx-auto "
                              : ""
                          } border border-gray-100 px-4 py-2 text-left text-tiny font-medium text-blue-900 uppercase tracking-wider break-normal`}
                        >
                          <div className="flex justify-between">
                            <span
                              className="flex items-center text-tiny break-normal"
                              {...column.getHeaderProps(column.getSortByToggleProps())}
                            >
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
                            {/* <div>{column.canFilter ? column.render("Filter") : null}</div> */}
                            {column?.Header !== "Edit" && column.filterable && (
                              <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                openFilter={openFilter}
                              >
                                {column.render("Filter")}
                              </GlobalFilter>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                  {page.map((p) => {
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
          </div>
        </div>
      </div>
    </div>
  );
}
