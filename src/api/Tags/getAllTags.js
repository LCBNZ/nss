import { useQuery } from "react-query";
import supabase from "../supabase";

export async function fetchAllTags() {
  const { data, error } = await supabase
    .from("scaffold_tags")
    .select("*, jobs:job_id(*, staff:supervisor(id, staff_name))")
    .order("job_id", { ascending: false })
    .order("tag_no", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }

  return formatPayloadDates(data);

}

export function useTags() {
  return useQuery("tags", () => fetchAllTags());
}

function formatPayloadDates(data) {
  return [...(data || [])].map((d) => {
    d.last_inspection = convertDate(d.last_inspection);
    d.inspection_due = convertDate(d.inspection_due);
    return d;
  });
}

function convertDate(date) {
  const dateParts = date.split("/");
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}
