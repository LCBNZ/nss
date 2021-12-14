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
import { InvestigationsApi } from "../../api";
import { CreateInvestigation } from "../../components/Investigations";

export { EditInvestigation } from "./Edit";
export { InvestigationDetails } from "./Details";

export const InvestigationMain = () => {
  const investigationsQuery = InvestigationsApi.useInvestigations();
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
      type: { value: null, matchMode: FilterMatchMode.EQUALS },
      action_required: { value: null, matchMode: FilterMatchMode.EQUALS },
      completed: { value: null, matchMode: FilterMatchMode.EQUALS },
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
            placeholder="Search Investigations"
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

  const typeFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={typeOptions}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={(option) => option}
      placeholder="Select a type"
      className="p-column-filter"
      showClear
    />
  );

  const actionFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={actionOptions}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={(option) => option}
      placeholder="Select a action"
      className="p-column-filter"
      showClear
    />
  );

  const completedFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={["No", "Yes"]}
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
        title="Investigation Reports"
        createBtn="Create Investigation"
        isEditable={false}
        setOpen={setOpen}
      />
      <Container>
        <div className="mx-auto mt-8">
          <DataTable
            ref={dt}
            value={investigationsQuery.data}
            loading={investigationsQuery.isLoading}
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
            globalFilterFields={["id", "type", "action_required", "note", "created_by"]}
            emptyMessage="No investigations found."
            scrollHeight="600px"
          >
            <Column
              header="ID (Details)"
              field="id"
              // body={(row) => `INV-${row.id + 1000}`}
              body={(row) => (
                <Link
                  key={`investigations${row.id}`}
                  to={`investigations/${row.id}/details`}
                  className="flex items-center"
                >
                  <FolderOpenIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="hover:text-gray-800">{`INV-${row.id}`}</span>
                </Link>
              )}
            />
            <Column
              header="Date Added"
              field="created_at"
              style={{ maxWidth: "8rem", textAlign: "center" }}
              body={(row) => moment(row.created_at).format("DD/MM/YYYY")}
            />
            <Column
              header="Type"
              field="type"
              filter
              filterElement={typeFilterTemplate}
              filterMenuStyle={{ width: "14rem" }}
            />
            <Column
              header="Action Required"
              field="action_required"
              style={{ minWidth: "8rem" }}
              filter
              filterElement={actionFilterTemplate}
              filterMenuStyle={{ width: "14rem" }}
            />
            <Column header="Assigned To" field="staff.staff_name" />
            <Column header="Date Required" field="date_required" />
            <Column
              header="Completed"
              field="completed"
              filter
              filterElement={completedFilterTemplate}
              filterMenuStyle={{ width: "14rem" }}
            />
            <Column header="Date Completed" field="date_completed" />
            <Column
              field="follow_up_file"
              header="Follow-up File"
              bodyClassName="p-text-center"
              style={{ width: "7rem", textAlign: "center" }}
              body={(row) => (
                <>
                  {row.follow_up_file && (
                    <a
                      href={row.follow_up_file}
                      target="_blank"
                      className="text-blue-700"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  )}
                </>
              )}
            />
            <Column
              field="file"
              header="Link"
              bodyClassName="p-text-center"
              style={{ width: "7rem", textAlign: "center" }}
              body={(row) => (
                <a href={row.file} target="_blank" className="text-blue-700" rel="noreferrer">
                  Link
                </a>
              )}
            />
            <Column
              field="note"
              header="Note"
              bodyClassName="p-text-center"
              style={{ minWidth: "10rem" }}
            />
            <Column field="created_by" header="Created By" bodyClassName="p-text-center" />
            <Column
              header="Edit"
              bodyClassName="p-text-center"
              style={{ width: "3rem" }}
              body={(row) => (
                <Link
                  to={{
                    pathname: `investigations/${row.id}/editInvestigation`,
                    state: { background: location, name: "editInvestigation" },
                  }}
                >
                  <PencilAltIcon className="text-gray-600 h-4 w-4" />
                </Link>
              )}
            />
          </DataTable>
        </div>
      </Container>
      <CreateInvestigation open={open} setOpen={setOpen} />
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
    text-align: center;
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

const typeOptions = [
  "Site Inspection Safety Checklist",
  "Incident",
  "Accident / Incident",
  "Scaffold Inspection",
  "Accident Investigation",
  "Prestart: Equipment & Additional Check",
  "HR Incident: Record of Discussion",
  "HR Incident: Disciplinary Procedure or Removal from Site",
  "HR Incident: Positive",
  "Vehicle Inspections",
  "Forklift Inspection",
  "Harness Inspections",
  "Lanyard Inspections",
  "Hoist Inspection",
  "Sling / Strop / Ratchet / Chain Inspection",
  "Office / Yard Inspection",
  "Pre-Start: New Hazard / Tool Box",
];

const actionOptions = [
  "Further Action Required",
  "Email / Inform Site Foreman",
  "Accident Investigation",
  "Rectify Failure",
];
