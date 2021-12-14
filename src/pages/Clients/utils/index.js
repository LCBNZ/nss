
import { MoreOptions, Badge } from "../../../common";

export const columns = [
  {
    Header: "Clients Name",
    accessor: "client_name",
  },
  {
    Header: "Sites",
    accessor: "sites",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Email",
    accessor: "email",
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
    Header: "",
    Cell: ({ row }) => <MoreOptions id={row?.original?.id} />,
    accessor: "options",
    width: 60,
  },
];
