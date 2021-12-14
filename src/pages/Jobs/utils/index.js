import { MoreOptions, Badge } from "../../../common";
import { formatDate } from "../../../utils";

export const columns = [
  {
    Header: "Job #",
    accessor: "job_num",
  },
  {
    Header: "Client",
    accessor: "clients.client_name",
  },
  {
    Header: "Site",
    accessor: "site",
  },
  {
    Header: "Start Date",
    accessor: "start_date",
    Cell: ({ value }) => formatDate(value),
  },
  {
    Header: "End Date",
    accessor: "end_date",
    Cell: ({ value }) => formatDate(value),
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
