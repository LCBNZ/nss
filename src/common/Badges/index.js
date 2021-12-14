import { classNames } from "../../utils";

export function Badge({ type, text }) {
  let styles = "";
  if (
    type === "Alert" ||
    type === "Rejected" ||
    type === "Issue" ||
    type === "High" ||
    type === "Signed Out"
  )
    styles = "bg-red-100 text-red-800";
  if (
    type === "Inactive" ||
    type === "Pending" ||
    type === "Med" ||
    type === "Pending Close Of Visit" ||
    type === "Pending Prestart"
  )
    styles = "bg-yellow-100 text-yellow-800";
  if (
    type === "Active" ||
    type === "Approved" ||
    type === "Operational" ||
    type === "Low" ||
    type === "Signed In" ||
    type === "Completed"
  )
    styles = "bg-green-100 text-green-800";

  return (
    <>
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
      >
        {text}
      </span>
    </>
  );
}
