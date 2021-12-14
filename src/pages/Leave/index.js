import React, { useState, useEffect } from "react";
import styled from "styled-components";
import clsx from "clsx";
// import moment from "moment";
import moment from "moment-business-days";
import { Link, useLocation } from "react-router-dom";
import { PencilAltIcon, FolderOpenIcon } from "@heroicons/react/solid";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";

import "primeicons/primeicons.css";
import "primereact/resources/themes/fluent-light/theme.css";
import "primereact/resources/primereact.css";

import { PageHeading, Badge } from "../../common";
import { ApproveLeave, DeclineLeave } from "../../components/Leave";
import { LeaveApi } from "../../api";

export { EditLeave } from "./Edit";

export const LeaveMain = () => {
  const leaveQuery = LeaveApi.useLeave("Pending");
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue] = useState("");

  const dt = React.useRef(null);

  useEffect(() => {
    initFilters();
  }, []);

  const formatDate = (value) =>
    value.toLocaleDateString("en-NZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const clearFilter = () => {
    initFilters();
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const onGlobalFilterChange = (e) => {
    const { value } = e.target;
    const _filters = { ...filters };
    _filters.global.value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      start_date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      end_date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
    });
    setGlobalFilterValue("");
  };

  const renderHeader = () => (
    <div className="-mb-12 -mt-8">
      <div className="flex items-center">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear Filters"
          className="p-button-outlined"
          onClick={clearFilter}
        />
        <span className="p-input-icon-left ml-2">
          {/* <i className="pi pi-search" /> */}
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange}
            placeholder="Search Leave"
          />
        </span>
      </div>
      <div className="mt-4">
        <Button
          type="button"
          icon="pi pi-file"
          label="Export"
          onClick={() => exportCSV(false)}
          className="p-mr-2 p-button-outlined"
          data-pr-tooltip="CSV"
        />
      </div>
    </div>
  );

  const dateBodyTemplate = (rowData, field) => {
    console.log("ROW DAA", rowData, field);
    return formatDate(rowData[field]);
  };
  const dateFilterTemplate = (options) => (
    <Calendar
      value={options.value}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      dateFormat="dd/mm/yy"
      placeholder="dd/mm/yyyy"
      mask="99/99/9999"
    />
  );

  return (
    <div>
      <PageHeading title="Leave" isEditable={false} setOpen={setOpen} />
      <Container>
        <div className="mx-auto mt-8">
          <DataTable
            ref={dt}
            value={leaveQuery.data}
            loading={leaveQuery.isLoading}
            header={renderHeader()}
            paginator
            paginatorPosition="top|bottom|both"
            showGridlines
            rows={25}
            rowsPerPageOptions={[25, 50, 100]}
            dataKey="id"
            filters={filters}
            filterDisplay="menu"
            // stripedRows
            responsiveLayout="scroll"
            globalFilterFields={["staff.staff_name", "type", "comments"]}
            emptyMessage="No leave found."
            scrollHeight="600px"
          >
            {/* <Column field="job_id" header="Job" /> */}
            <Column
              header="Date Added"
              field="created_at"
              // filterField="time_on"
              style={{ maxWidth: "6rem" }}
              body={(row) => moment(row.created_at).format("DD/MM/YYYY")}
            />
            <Column header="Staff" field="staff.staff_name" />
            <Column header="Leave Type" field="type" />
            <Column
              header="Start Date"
              field="start_date"
              filterField="start_date"
              dataType="date"
              filter
              filterElement={dateFilterTemplate}
              body={(row) => dateBodyTemplate(row, "start_date")}
            />
            <Column
              header="End Date"
              field="end_date"
              filterField="end_date"
              dataType="date"
              filter
              filterElement={dateFilterTemplate}
              body={(row) => dateBodyTemplate(row, "end_date")}
            />
            <Column header="Comments" field="comments" style={{ minWidth: "10rem" }} />
            <Column
              field="total_days"
              header="Total Leave Days"
              bodyClassName="p-text-center"
              style={{ width: "8rem", textAlign: 'center' }}
              body={(row) => {
                const start = row.start_date;
                const end = row.end_date;
                const diff = moment(end).businessDiff(moment(start));
                console.log("DIFF >>> ", diff);

                return diff + 1;
              }}
            />
            <Column
              header="Approve"
              style={{ width: "8rem", paddingLeft: "20px" }}
              body={(row) => {
                const start = moment(row.start_date).format("DD/MM/YYYY");
                const end = moment(row.end_date).format("DD/MM/YYYY");

                return (
                  <ApproveLeave
                    staffId={row.staff?.id}
                    staff={row.staff?.staff_name}
                    email={row.staff?.email}
                    leaveId={row.id}
                    start={start}
                    end={end}
                    type={row.type}
                    comments={row.comments}
                  />
                );
              }}
            />
            <Column
              header="Decline"
              bodyClassName="p-text-center"
              style={{ width: "8rem", paddingLeft: "20px" }}
              body={(row) => {
                const start = moment(row.start_date).format("DD/MM/YYYY");
                const end = moment(row.end_date).format("DD/MM/YYYY");

                return (
                  <DeclineLeave
                    staffId={row.staff?.id}
                    staff={row.staff?.staff_name}
                    email={row.staff?.email}
                    leaveId={row.id}
                    start={start}
                    end={end}
                    type={row.type}
                    comments={row.comments}
                  />
                );
              }}
            />
            <Column
              header="Edit"
              bodyClassName="p-text-center"
              style={{ width: "3rem" }}
              body={(row) => (
                <Link
                  to={{
                    pathname: `leave/${row.id}/editLeave`,
                    state: { background: location, name: "editLeave" },
                  }}
                >
                  <PencilAltIcon className="text-gray-600 h-4 w-4" />
                </Link>
              )}
            />
          </DataTable>
        </div>
      </Container>
    </div>
  );
};

const Container = styled.div`
  padding: 0 16px;

  .p-datatable-wrapper {
    padding: 0 8px;
  }

  .p-rowgroup-header {
    background: #e5e7eb !important;
  }
  .p-rowgroup-header-name > td > span {
    color: #374151 !important;
  }
  .p-datatable-thead > tr > th {
    background-color: #f3f4f6;
    color: #1e3a8a;
    padding: 4px;
    font-size: 12px;
    border: 1px solid #e5e7eb;
  }
  .p-datatable-thead > tr > th > div > span {
    margin-left: 12px;
  }

  .p-datatable-tbody > tr > td {
    padding: 4px;
  }
  .p-datatable-wrapper > table > tbody > tr > td > div {
    margin-left: 9px;
  }

  .p-button {
    padding: 2px 8px;
  }

  .p-inputtext {
    padding: 3px 8px;
    border-color: #d1d5db;
    border-radius: 6px;
  }

  .p-dropdown {
    border-color: #d1d5db;
    border-radius: 6px;
  }

  .p-paginator {
    justify-content: right;
    border: none;
  }

  .p-datatable.p-datatable-gridlines .p-datatable-header {
    border: none;
  }

  .p-paginator-element {
    color: #4f46e5;
  }
`;
