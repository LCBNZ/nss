import { useQuery } from "react-query";
import moment from "moment";
import supabase from "../supabase";

export async function fetchAllTimesheets(status) {
  const { data, error } = await supabase
    .from("timesheets")
    .select("*, staff:staff_id(id, staff_name), job:job_id(id, site)")
    .eq("status", status)
    // .eq("staff_id", 58)
    .order("staff_id", { ascending: false })
    .order("id", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return formatPayloadDates(data);
}

export function useTimesheets(status) {
  return useQuery("timesheets", () => fetchAllTimesheets(status));
}

function formatPayloadDates(data) {
  return [...(data || [])].map((d) => {
    const start = moment(d.time_on, "HH:mm");
    const finish = moment(d.time_off, "HH:mm");
    const duration = moment.duration(finish.diff(start));
    const hours = duration.asHours();
    d.hours = hours.toFixed(2)
    d.date = d.date ? convertDate(d.date) : "";
    return d;
  });
}

function convertDate(date) {
  console.log("DATE", date);
  const dateParts = date.split("/");
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}
