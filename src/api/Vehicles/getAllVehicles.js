import { useQuery } from "react-query";
import supabase from "../supabase";

async function fetchAllVehicles() {
  const { data, error } = await supabase
    .from("vehicles")
    .select('*')
    .order("id", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return formatPayloadDates(data);
}

export function useVehicles() {
  return useQuery("vehicles", () => fetchAllVehicles());
}

function formatPayloadDates(data) {
  return [...(data || [])].map((d) => {
    d.rego_due = d.rego_due ? convertDate(d.rego_due) : null;
    d.wof_due = d.wof_due ? convertDate(d.wof_due) : null;
    d.service_due_date = d.service_due_date ? convertDate(d.service_due_date) : null;
    return d;
  });
}

function convertDate(date) {
  const dateParts = date.split("/");
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}
