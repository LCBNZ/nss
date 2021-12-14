import { numberFormat } from "../../utils";

export const quoteLinesColumns = [
  {
    Header: "Zones",
    accessor: "zone",
    width: 60,
  },
  {
    Header: "Zone Label",
    accessor: "zone_label",
  },
  {
    Header: "Type",
    accessor: "type",
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Length",
    accessor: "length",
  },
  {
    Header: "Height",
    accessor: "height",
  },
  {
    Header: "Width",
    accessor: "width",
  },
  {
    Header: "Total Dimensions",
    accessor: "total_dimensions",
  },
  {
    Header: "Weekly Duration",
    accessor: "weekly_duration",
  },
  {
    Header: "Transport",
    accessor: "transport",
    Cell: ({ row }) => numberFormat.format(row?.original?.transport),
  },
  {
    Header: "Erect/Dismantle",
    accessor: "erect_dismantle",
    Cell: ({ row }) => numberFormat.format(row?.original?.erect_dismantle),
  },
  {
    Header: "Hire Fee",
    accessor: "hire_fee",
    Cell: ({ row }) => numberFormat.format(row?.original?.hire_fee),
  },
  {
    Header: "Total Amount",
    Footer: "Summary",
    accessor: "total",
    Cell: ({ row }) => numberFormat.format(row?.original?.total),
  },
];

export const quoteAddonColumns = [
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Duration",
    accessor: "duration",
  },
  {
    Header: "Hire Fee",
    accessor: "hire_fee",
    Cell: ({ row }) => numberFormat.format(row?.original?.hire_fee),
  },
  {
    Header: "Width",
    accessor: "width",
  },
  {
    Header: "Fixed Charge",
    accessor: "fixed_charge",
    Cell: ({ row }) => numberFormat.format(row?.original?.fixed_charge),
  },
  {
    Header: "Total",
    accessor: "total",
    Cell: ({ row }) => numberFormat.format(row?.original?.total),
  },
];
