import { MoreOptions, Badge } from "../../common";
import { formatDate } from "../../utils";

export const columns = [
  {
    Header: "Date",
    accessor: "date",
  },
  {
    Header: "job",
    accessor: "job_id",
  },
  {
    Header: "Team Leader",
    accessor: "team_leader_id",
  },
  {
    Header: "Staff",
    accessor: "staff",
  },
  {
    Header: "Tasks",
    accessor: "tasks",
  },
  {
    Header: "Notes",
    accessor: "notes",
  },
  {
    Header: "Risk",
    accessor: "risk",
  },
  {
    Header: "Status",
    accessor: "visit_status",
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
