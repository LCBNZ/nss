import React, { useState, useEffect } from "react";
import styled from "styled-components";
import clsx from "clsx";
import moment from "moment";
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
import { TagsApi } from "../../api";
import { CreateTag } from "../../components/Tags";

export { EditTag } from "./EditTag";
export { TagDetails } from "./Details";

export const TagsMain = () => {
  const tagsQuery = TagsApi.useTags();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const [selectedTimesheets, setSelectedTimesheets] = useState(null);
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
      last_inspection: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      inspection_due: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      status: { value: "Active", matchMode: FilterMatchMode.EQUALS },
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
            placeholder="Search Tags"
          />
        </span>
      </div>
      <div className="mt-4">
        <Button
          type="button"
          icon="pi pi-file"
          label="Export"
          onClick={() => exportCSV(false)}
          className="p-mr-2"
          data-pr-tooltip="CSV"
        />
      </div>
    </div>
  );

  const dateBodyTemplate = (rowData, field) => formatDate(rowData[field]);
  const dateFilterTemplate = (options) => (
    <Calendar
      value={options.value}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      dateFormat="dd/mm/yy"
      placeholder="dd/mm/yyyy"
      mask="99/99/9999"
    />
  );
  const headerTemplate = (data) => (
    <td className="" colSpan="6">
      <span className="text-gray-900 font-bold">
        {data.job_id + 1000} - {data.jobs.site}
      </span>
    </td>
  );

      const statusFilterTemplate = (options) => (
          <Dropdown
            value={options.value}
            options={['Active', 'Inactive']}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            itemTemplate={(option) => option}
            placeholder="Select a Status"
            className="p-column-filter"
            showClear
          />
        );

  return (
    <div>
      <PageHeading
        title="Scaffold Register"
        createBtn="Create Register"
        isEditable={false}
        setOpen={setOpen}
      />
      <Container>
        <div className="mx-auto mt-8">
          <DataTable
            ref={dt}
            value={tagsQuery.data}
            loading={tagsQuery.isLoading}
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
            globalFilterFields={[
              "tag_no",
              "job_id",
              "jobs.site",
              "jobs.staff.staff_name",
              "description",
              "status",
            ]}
            header={renderHeader()}
            emptyMessage="No tags found."
            rowGroupMode="subheader"
            groupRowsBy="job_id"
            rowGroupHeaderTemplate={headerTemplate}
            selection={selectedTimesheets}
            onSelectionChange={(e) => setSelectedTimesheets(e.value)}
            scrollHeight="600px"
          >
            {/* <Column field="job_id" header="Job" /> */}
            <Column
              header="Tag # (Details)"
              field="tag_no"
              // filterField="time_on"
              style={{ maxWidth: "8rem", textAlign: "center" }}
              body={(row) => (
                <Link
                  key={`tag${row.id}`}
                  to={`scaffold-register/${row.id}/details`}
                  className="flex items-center"
                >
                  <FolderOpenIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="hover:text-gray-800">{row.tag_no}</span>
                </Link>
              )}
            />
            <Column header="Supervisor" field="jobs.staff.staff_name" />
            <Column header="Description" field="description" style={{ minWidth: "10rem" }} />
            <Column
              header="Last Inspection"
              field="last_inspection"
              body={(data) => dateBodyTemplate(data, "last_inspection")}
              filterField="last_inspection"
              dataType="date"
              // style={{ minWidth: "10rem" }}
              filter
              filterElement={dateFilterTemplate}
            />
            <Column
              header="Inspection Due"
              field="inspection_due"
              // body={(data) => dateBodyTemplate(data, "inspection_due")}
              filterField="inspection_due"
              dataType="date"
              body={(row) => {
                const date = moment(row.inspection_due, "DD/MM/YYYY");
                const isNextWeek = date.diff(moment(), "days");
                return (
                  <span
                    className={clsx(
                      isNextWeek <= 0 ? "text-red-500" : "",
                      isNextWeek > 0 && isNextWeek < 8 ? "text-yellow-500" : "",
                      "font-semibold text-center",
                    )}
                  >
                    {dateBodyTemplate(row, "inspection_due")}
                  </span>
                );
              }}
              filter
              filterElement={dateFilterTemplate}
            />
            <Column
              field="status"
              header="Status"
              bodyClassName="p-text-center"
              style={{ width: "10rem", textAlign: "center" }}
              body={(row) => <Badge type={row.status} text={row.status} />}
              filter
              filterElement={statusFilterTemplate}
              filterMenuStyle={{ width: "14rem" }}
            />
            <Column
              // field="status"
              header="Edit"
              bodyClassName="p-text-center"
              style={{ width: "3rem" }}
              body={(row) => (
                <Link
                  to={{
                    pathname: `scaffold-register/${row.id}/editTag`,
                    state: { background: location, name: "editTag" },
                  }}
                >
                  <PencilAltIcon className="text-gray-600 h-4 w-4" />
                </Link>
              )}
            />
          </DataTable>
        </div>
      </Container>
      <CreateTag open={open} setOpen={setOpen} />
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
