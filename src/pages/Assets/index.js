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
import { AssetsApi } from "../../api";
import { CreateAsset, typeDropdowns, categoryDropdowns } from "../../components/Assets";

export { EditAsset } from "./EditAsset";
export { AssetDetails } from "./Details";

export const AssetsMain = () => {
  const assetQuery = AssetsApi.useAssets();
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
      asset_category: { value: null, matchMode: FilterMatchMode.EQUALS },
      asset_type: { value: null, matchMode: FilterMatchMode.EQUALS },
      last_inspected: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      next_inspection: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      asset_expiry: {
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
            placeholder="Search Assets"
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
    if (rowData[field]) {
      const date = moment(rowData[field], "DD/MM/YYYY");
      const isNextWeek = date.diff(moment(), "days");
      return (
        <span
          className={clsx(
            isNextWeek <= 0 ? "text-red-500" : "",
            isNextWeek > 0 && isNextWeek < 8 ? "text-yellow-500" : "",
            "font-semibold text-center",
          )}
        >
          {formatDate(rowData[field])}
        </span>
      );
    }
    return "";
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


  const categoryFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={categoryDropdowns}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      itemTemplate={(option) => option}
      placeholder="Select a category"
      className="p-column-filter"
      showClear
    />
  );

    const typeFilterTemplate = (options) => (
      <Dropdown
        value={options.value}
        options={typeDropdowns}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={(option) => option}
        placeholder="Select a type"
        className="p-column-filter"
        showClear
      />
    );

  return (
    <div>
      <PageHeading title="Assets" createBtn="Create Asset" isEditable={false} setOpen={setOpen} />
      <Container>
        <div className="mx-auto mt-8">
          <DataTable
            ref={dt}
            value={assetQuery.data}
            loading={assetQuery.isLoading}
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
            globalFilterFields={[
              "manufacture_num",
              "asset_category",
              "assigned_to",
            ]}
            emptyMessage="No staff found."
            scrollHeight="600px"
          >
            {/* <Column field="job_id" header="Job" /> */}
            <Column
              header="Asset # (Details)"
              field="id"
              // filterField="time_on"
              style={{ maxWidth: "8rem", textAlign: "center" }}
              body={(row) => (
                <Link
                  key={`assets${row.id}`}
                  to={`assets/${row.id}/details`}
                  className="flex items-center"
                >
                  <FolderOpenIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="hover:text-gray-800">{row.id + 1000}</span>
                </Link>
              )}
            />
            <Column header="Manufactures #" field="manufacture_num" />
            <Column
              header="Asset Type"
              field="asset_type"
              style={{ minWidth: "10rem" }}
              filter
              filterElement={typeFilterTemplate}
              filterMenuStyle={{ width: "14rem" }}
            />
            <Column
              header="Asset Category"
              field="asset_category"
              style={{ minWidth: "10rem" }}
              filter
              filterElement={categoryFilterTemplate}
              filterMenuStyle={{ width: "14rem" }}
            />
            <Column header="Assigned To" field="assigned_to" style={{ minWidth: "10rem" }} />
            <Column
              header="Last Inspection"
              field="last_inspected"
              body={(data) => dateBodyTemplate(data, "last_inspected")}
              filterField="last_inspected"
              dataType="date"
              // style={{ minWidth: "10rem" }}
              filter
              filterElement={dateFilterTemplate}
            />
            <Column
              header="Next Inspection"
              field="next_inspection"
              body={(data) => dateBodyTemplate(data, "next_inspection")}
              filterField="next_inspection"
              dataType="date"
              // style={{ minWidth: "10rem" }}
              filter
              filterElement={dateFilterTemplate}
            />
            <Column
              header="Asset Expiry"
              field="asset_expiry"
              body={(data) => dateBodyTemplate(data, "asset_expiry")}
              filterField="asset_expiry"
              dataType="date"
              // style={{ minWidth: "10rem" }}
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
              header="Edit"
              bodyClassName="p-text-center"
              style={{ width: "3rem" }}
              body={(row) => (
                <Link
                  to={{
                    pathname: `assets/${row.id}/editAsset`,
                    state: { background: location, name: "editAsset" },
                  }}
                >
                  <PencilAltIcon className="text-gray-600 h-4 w-4" />
                </Link>
              )}
            />
          </DataTable>
        </div>
      </Container>
      <CreateAsset open={open} setOpen={setOpen} />
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
