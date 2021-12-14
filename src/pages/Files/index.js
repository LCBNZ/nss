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
import { FilesApi } from "../../api";

export const FilesMain = () => {
  const filesQuery = FilesApi.useFetchAppFiles();
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
      // type: { value: null, matchMode: FilterMatchMode.EQUALS },
      // status: { value: "Active", matchMode: FilterMatchMode.EQUALS },
      // job_status: { value: null, matchMode: FilterMatchMode.EQUALS },
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
            placeholder="Search Files"
          />
        </span>
      </div>
    </div>
  );

  const statusFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={["Active", "Inactive"]}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={(option) => option}
      placeholder="Select a Status"
      className="p-column-filter"
      showClear
    />
  );

  const jobStatusDropdowns = [
    "Admin",
    "Install In Progress",
    "Install Complete",
    "Variation In Progress",
    "Variation Complete",
    "Dismantle In Progress",
    "Dismantle Complete",
    "Job Complete",
    "Admin Complete",
    "Pending Handover",
  ];

  const jobStatusFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={jobStatusDropdowns}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={(option) => option}
      placeholder="Select a Status"
      className="p-column-filter"
      showClear
    />
  );

  const staffTypeFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={["Employee", "Scaffolder", "Office", "Foreman", "Truck Driver", "Application"]}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={(option) => option}
      placeholder="Select a Status"
      className="p-column-filter"
      showClear
    />
  );

  return (
    <div>
      <PageHeading title="App Files" isEditable={false} setOpen={setOpen} />
      <Container>
        <div className="mx-auto mt-8">
          <DataTable
            ref={dt}
            value={filesQuery.data}
            loading={filesQuery.isLoading}
            header={renderHeader()}
            paginator
            paginatorPosition="top|bottom|both"
            showGridlines
            rows={100}
            rowsPerPageOptions={[100, 500, 1000]}
            dataKey="id"
            filters={filters}
            filterDisplay="menu"
            // stripedRows
            responsiveLayout="scroll"
            globalFilterFields={[
              "file_name",
              "file_type",
              "uploaded_by",
            ]}
            emptyMessage="No files found."
            scrollHeight="600px"
          >
            <Column
              header="Date Added"
              field="created_at"
              body={(row) => moment(row.created_at).format("DD/MM/YYYY")}
            />
            <Column header="File Name" field="file_name" style={{ minWidth: "10rem" }} />
            <Column
              header="File Type"
              field="file_type"
              style={{ minWidth: "10rem" }}
              // body={(row) => (row.start_date ? formatDate(row.start_date) : "")}
            />
            <Column
              header="File"
              field="link"
              style={{ width: "5rem", textAlign: 'center' }}
              body={(row) => (
                <>
                  <a href={row.link} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold">
                    Link
                  </a>
                </>
              )}
            />
            <Column
              field="uploaded_by"
              header="Uploaded By"
              bodyClassName="p-text-center"
              style={{ width: "10rem" }}
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
