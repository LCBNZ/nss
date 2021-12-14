import React, { useState, useEffect } from "react";
import styled from "styled-components";
import clsx from "clsx";
import moment from "moment";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { Link, useLocation } from "react-router-dom";
import {
  PencilAltIcon,
  FolderOpenIcon,
  DuplicateIcon,
  ClipboardCopyIcon,
  DocumentTextIcon,
} from "@heroicons/react/solid";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { classNames, numberFormat } from "../../utils";

import "primeicons/primeicons.css";
import "primereact/resources/themes/fluent-light/theme.css";
import "primereact/resources/primereact.css";

import { PageHeading, Badge } from "../../common";
import { QuotesApi } from "../../api";

import { ConfirmationDialog } from "../../common/Confirmation/Confirmation";
import { ApproveQuote } from "../../components/Quote/ApproveQuote";
import { DeclineQuote } from "../../components/Quote/DeclineQuote";

export { QuoteDetails } from "./Details/Details";
export { AddQuote } from "./AddQuote";
export { EditQuote } from "./Edit";
export { QuotePdf } from "../../components/Quote/pdf/Pdf";

export const QuotesMain = () => {

  const [isDuplicating, setIsDuplicating] = useState(false);
  const [quote, setQuote] = useStateWithCallbackLazy(null);
  const [cloneQuote, setCloneQuote] = useStateWithCallbackLazy(null);

  const [filters, setFilters] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue] = useState("");

  const quotesQuery = QuotesApi.useQuotes();
  const duplicateMutation = QuotesApi.useDuplicate(quote);
  const cloneMutation = QuotesApi.useClone(cloneQuote);

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
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
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
            placeholder="Search Quotes"
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
  const statusFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={['Pending', "Approved", "Declined"]}
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
      <PageHeading
        title="Quotes"
        createBtn="Create Quote"
        isEditable={false}
        navigate="add-quote"
      />
      <Container>
        <div className="mx-auto mt-8">
          <DataTable
            ref={dt}
            value={quotesQuery.data}
            loading={quotesQuery.isLoading}
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
              "clients.client_name",
              "client_contacts.name",
              "client_contacts.email",
              "address_street1",
              "staff.staff_name",
              "status",
            ]}
            emptyMessage="No quotes found."
            scrollHeight="600px"
          >
            <Column
              header="Created At"
              field="created_at"
              body={(row) => moment(row.created_at).format("DD/MM/YYYY")}
            />
            <Column
              header="Quote # (Details)"
              field="id"
              // filterField="time_on"
              style={{ maxWidth: "8rem", textAlign: "center" }}
              body={(row) => {
                const id = row?.id;
                const num = row?.quote_num;
                const version = row?.version;
                return (
                  <Link
                    key={`details${id}`}
                    to={`quotes/${id}/details`}
                    className="flex items-center"
                  >
                    <FolderOpenIcon className="h-4 w-4 text-gray-500" />
                    {num}
                  </Link>
                );
              }}
            />

            <Column
              header="Client Name"
              field="clients.client_name"
              style={{ minWidth: "10rem" }}
            />
            <Column
              header="Contact Name"
              field="client_contacts.name"
              style={{ minWidth: "10rem" }}
            />
            <Column
              header="Contact Email"
              field="client_contacts.email"
              style={{ minWidth: "10rem" }}
            />
            <Column
              header="Site Address"
              field="address_street1"
              style={{ minWidth: "10rem" }}
              body={(row) => {
                const fields = [[row.street_1], [row.street_2]];
                const addressfields = fields
                  .map((part) => part.filter(Boolean).join(" "))
                  .filter((str) => str.length)
                  .join(", ");
                return (
                  <>
                    <div>{addressfields}</div>
                    {row?.city && <div>{row?.city}</div>}
                  </>
                );
              }}
            />
            <Column header="Estimator" field="staff.staff_name" style={{ minWidth: "10rem" }} />
            <Column
              header="Total Amount"
              field="total_amount"
              body={(row) => numberFormat.format(row.total_amount)}
            />
            <Column
              header="Status"
              field="status"
              body={(row) => <Badge type={row.status} text={row.status} />}
              filter
              filterElement={statusFilterTemplate}
              filterMenuStyle={{ width: "14rem" }}
            />
            <Column
              header="Last Updated"
              field="updated_at"
              body={(row) => moment(row.updated_at).format("DD/MM/YYYY h:mm a")}
            />
            <Column
              header="Approve"
              style={{ minWidth: "10rem" }}
              body={(row) => {
                const status = row?.status;
                const quoteId = row?.id;
                return <ApproveQuote quoteId={quoteId} status={status} quotePayload={row} />;
              }}
            />
            <Column
              header="Reject"
              style={{ minWidth: "10rem" }}
              body={(row) => {
                const status = row?.status;
                const quoteId = row?.id;
                return <DeclineQuote quoteId={quoteId} status={status} quotePayload={row} />;
              }}
            />
            <Column
              header="Edit"
              body={(row) => {
                const id = row?.id;
                const quoteStatus = row.status;
                const canEdit = quoteStatus !== "Approved" && quoteStatus !== "Rejected";
                return (
                  <Link
                    to={
                      canEdit
                        ? {
                            pathname: `quotes/${id}/edit`,
                          }
                        : {}
                    }
                  >
                    <PencilAltIcon
                      className={classNames(canEdit ? "text-gray-600" : "text-gray-200", "h-4 w-4")}
                    />
                  </Link>
                );
              }}
            />
            <Column
              header="Duplicate"
              body={(row) => {
                const quoteId = row?.id;
                const quoteStatus = row?.status;
                const canEdit = quoteStatus !== "Approved" && quoteStatus !== "Rejected";
                // console.log("duplicateMutation", duplicateMutation);
                return (
                  <ConfirmationDialog
                    isDone={setTimeout(() => true, 1000)}
                    icon="info"
                    title="Duplicate Quote"
                    body="Duplicating this quote will create a new copy, incrementing the version by 1."
                    triggerButton={
                      <button type="button">
                        <DuplicateIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    }
                    confirmButton={
                      <Button
                        isLoading={duplicateMutation?.isLoading}
                        variant="primary"
                        // className="bg-blue-600 text-white hover:bg-blue-700:text-white rounded-lg"
                        onClick={async (e) => {
                          e.preventDefault();
                          const data = await QuotesApi.fetchQuote(quoteId);
                          setQuote(data, async () => {
                            // await duplicate(data);
                            try {
                              console.time("duplicate quote");
                              setIsDuplicating(true);
                              await duplicateMutation.mutateAsync();
                              setIsDuplicating(false);
                              console.timeEnd("duplicate quote");
                            } catch (err) {
                              console.log("ERR", err);
                            }
                          });
                        }}
                      >
                        Duplicate Quote
                      </Button>
                    }
                  />
                );
              }}
            />
            <Column
              header="Clone"
              body={(row) => {
                const quoteId = row?.id;
                const quoteStatus = row.status;
                const canEdit = quoteStatus !== "Approved" && quoteStatus !== "Rejected";
                return (
                  <ConfirmationDialog
                    isDone={setTimeout(() => true, 1000)}
                    icon="info"
                    title="Clone Quote"
                    body="Cloning this quote will generate a new quote number with blank client, contact and site address fields"
                    triggerButton={
                      <button type="button">
                        <ClipboardCopyIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    }
                    confirmButton={
                      <Button
                        isLoading={cloneMutation?.isLoading}
                        variant="primary"
                        // className="bg-blue-600 text-white hover:bg-blue-700:text-white rounded-lg"
                        onClick={async (e) => {
                          e.preventDefault();
                          const data = await QuotesApi.fetchQuote(quoteId);
                          setCloneQuote(data, async () => {
                            try {
                              console.time("clone quote");
                              setIsDuplicating(true);
                              await cloneMutation.mutateAsync();
                              setIsDuplicating(false);
                              console.timeEnd("clone quote");
                            } catch (err) {
                              console.log("ERR", err);
                            }
                          });
                        }}
                      >
                        Clone Quote
                      </Button>
                    }
                  />
                );
              }}
            />
            <Column
              header="Export"
              body={(row) => (
                <Link key={`output${row.id}`} to={`quotes/${row.id}/output`} target="_blank">
                  <DocumentTextIcon className="h-4 w-4 text-gray-600" />
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
    text-align: "center";
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
