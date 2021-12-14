import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchAllLeave(status) {
  const { data, error } = await supabase
    .from("leave")
    .select("*, staff:staff_id(id, staff_name, email)")
    .eq("status", status)
    .order("staff_id", { ascending: false })
    .order("id", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return formatPayloadDates(data);
}

export function useLeave(status) {
  return useQuery("leave", () => fetchAllLeave(status));
}

function formatPayloadDates(data) {
  return [...(data || [])].map((d) => {
    d.start_date = d.start_date ? convertDate(d.start_date) : "";
    d.end_date = d.end_date ? convertDate(d.end_date) : "";
    return d;
  });
}

function convertDate(date) {
  console.log("DATE", date);
  const dateParts = date.split("/");
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}
