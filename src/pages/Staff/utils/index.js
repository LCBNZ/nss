import { MoreOptions, Badge } from "../../../common";

export const columns = [
  {
    Header: "Staff Name",
    accessor: "staff_name",
  },
  {
    Header: "Type",
    accessor: "type",
  },
  {
    Header: "Phone",
    accessor: "mobile",
  },
  {
    Header: "Position",
    accessor: "position",
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ row }) => {
      const type = row?.original?.status;
      return <Badge type={type} text={type} />;
    },
  },
  {
    Header: "",
    Cell: ({ row }) => <MoreOptions id={row?.original?.id} />,
    accessor: "options",
    width: 60,
  },
];

