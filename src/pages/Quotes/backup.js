import React, { useEffect, useState } from "react";
import moment from "moment";
import { useStateWithCallbackLazy } from "use-state-with-callback";

import { Link, useLocation } from "react-router-dom";
import {
  XIcon,
  CheckIcon,
  PencilAltIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  DuplicateIcon,
  ClipboardCopyIcon,
} from "@heroicons/react/solid";
import { classNames, numberFormat } from "../../utils";

import { PageHeading, Table, MoreOptions, Badge, Button, Spinner } from "../../common";
import { QuotesApi } from "../../api";
import { useUpdateQuoteStatus } from "../../api/Quotes";
import { ConfirmationDialog } from "../../common/Confirmation/Confirmation";
import { ApproveQuote } from "../../components/Quote/ApproveQuote";
import { DeclineQuote } from "../../components/Quote/DeclineQuote";
import { duplicate } from "../../api/Quotes/actions";

export { QuoteDetails } from "./Details/Details";
export { AddQuote } from "./AddQuote";
export { EditQuote } from "./Edit";
export { QuotePdf } from "../../components/Quote/pdf/Pdf";

export const QuotesMain = () => {
  const location = useLocation();

  const [isDuplicating, setIsDuplicating] = useState(false);
  const [approveId, setApproveId] = useStateWithCallbackLazy(null);
  const [quote, setQuote] = useStateWithCallbackLazy(null);
  const [cloneQuote, setCloneQuote] = useStateWithCallbackLazy(null);

  const { status, data, error, isFetching } = QuotesApi.useQuotes();

  const duplicateMutation = QuotesApi.useDuplicate(quote);
  const cloneMutation = QuotesApi.useClone(cloneQuote);

  const quoteStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  // const updateApproveStatus = useUpdateQuoteStatus(approveId, "Approved");
  // const updateRejectStatus = useUpdateQuoteStatus(approveId, "Rejected");

  if (status === "loading")
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  if (status === "error") return <div>Error: {error.message}</div>;

  const columns = [
    {
      Header: "Created",
      accessor: "created_at",
      Cell: ({ row }) => {
        const created = row?.original?.created_at;
        return moment(created).format("DD/MM/YYYY");
      },
    },
    {
      Header: "Quote # (Details)",
      Cell: ({ row }) => {
        const id = row?.original?.id;
        const num = row?.original?.quote_num;
        const version = row?.original?.version;
        return (
          <Link key={`details${id}`} to={`quotes/${id}/details`} className="flex items-center">
            <FolderOpenIcon className="h-4 w-4 text-gray-500" />
            {num}
          </Link>
        );
      },
    },
    {
      Header: "Client Name",
      accessor: "clients.client_name",
    },
    {
      Header: "Contact Name",
      accessor: "client_contacts.name",
    },
    {
      Header: "Contact Email",
      accessor: "client_contacts.email",
    },
    {
      Header: "Site Address",
      style: { whiteSpace: "unset" },
      accessor: "address_street1",
      Cell: ({ row }) => {
        const item = row?.original;
        const fields = [[item.street_1], [item.street_2]];
        const addressfields = fields
          .map((part) => part.filter(Boolean).join(" "))
          .filter((str) => str.length)
          .join(", ");
        return (
          <>
            <div>{addressfields}</div>
            {item?.city && <div>{item?.city}</div>}
          </>
        );
      },
    },
    {
      Header: "Estimator",
      accessor: "staff.staff_name",
    },
    {
      Header: "Total Amount",
      accessor: "total_amount",
      Cell: ({ row }) => {
        const amount = row?.original?.total_amount;
        return numberFormat.format(amount);
      },
    },
    {
      Header: "Status",
      Cell: ({ row }) => {
        const type = row?.original?.status;
        return <Badge type={type} text={type} />;
      },
      width: 60,
      accessor: "status",
    },
    {
      Header: "Last Updated",
      accessor: "updated_at",
      Cell: ({ row }) => {
        const created = row?.original?.updated_at;
        return moment(created).format("DD/MM/YYYY h:mm a");
      },
    },
    {
      Header: "Approve",
      Cell: ({ row }) => {
        const status = row?.original?.status;
        const quoteId = row?.original?.id;
        return <ApproveQuote quoteId={quoteId} status={status} quotePayload={row?.original} />;
      },
      accessor: "",
      width: 20,
    },
    {
      Header: "Reject",
      Cell: ({ row }) => {
        const status = row?.original?.status;
        const quoteId = row?.original?.id;
        return <DeclineQuote quoteId={quoteId} status={status} />;
      },
      accessor: "",
      width: 20,
    },
    {
      Header: "Edit",
      Cell: ({ row }) => {
        const id = row?.original?.id;
        const quoteStatus = row?.original.status;
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
      },
      width: 10,
      accessor: "edit",
    },
    {
      Header: "Duplicate",
      Cell: ({ row }) => {
        const quoteId = row?.original?.id;
        const quoteStatus = row?.original.status;
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
      },
      width: 10,
      accessor: "duplicate",
    },
    {
      Header: "Clone",
      Cell: ({ row }) => {
        const quoteId = row?.original?.id;
        const quoteStatus = row?.original.status;
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
      },
      width: 10,
      accessor: "clone",
    },
    {
      Header: "Export",
      Cell: ({ row }) => {
        const id = row?.original?.id;
        return (
          <Link key={`output${id}`} to={`quotes/${id}/output`} target="_blank">
            <DocumentTextIcon className="h-4 w-4 text-gray-600" />
          </Link>
        );
      },
      width: 10,
      accessor: "details",
    },
    // {
    //   Header: "",
    //   Cell: ({ row }) => (
    //     <MoreOptions
    //       id={row?.original?.id}
    //       setDuplicate={async (val) => {
    //         const data = await QuotesApi.fetchQuote(val);

    //         setQuote(data, async () => {
    //           try {
    //             console.time("duplicate quote");
    //             setIsDuplicating(true);
    //             await duplicateMutation.mutateAsync();
    //             setIsDuplicating(false);
    //             console.timeEnd("duplicate quote");
    //           } catch (err) {
    //             console.log("ERR", err);
    //           }
    //         });
    //       }}
    //       setClone={async (val) => {
    //         const data = await QuotesApi.fetchQuote(val);

    //         setCloneQuote(data, async () => {
    //           try {
    //             console.time("duplicate quote");
    //             setIsDuplicating(true);
    //             await cloneMutation.mutateAsync();
    //             setIsDuplicating(false);
    //             console.timeEnd("duplicate quote");
    //           } catch (err) {
    //             console.log("ERR", err);
    //           }
    //         });
    //       }}
    //     />
    //   ),
    //   accessor: "options",
    //   width: 20,
    // },
  ];

  return (
    <div>
      <PageHeading
        title="Quotes"
        createBtn="Create Quote"
        isEditable={false}
        navigate="add-quote"
      />
      {isDuplicating && (
        <div className="fixed w-full h-48 flex justify-center items-center z-50">
          <Spinner size="lg" />
        </div>
      )}
      <Table cols={columns} tableData={data} searchPlaceholder="Search Quotes" />
    </div>
  );
};
