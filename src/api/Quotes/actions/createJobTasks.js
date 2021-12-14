import { useMutation, useQueryClient } from "react-query";

import supabase from "../../supabase";
import { useNotificationStore } from "../../../store/notifications";

export async function createJobTasksFromQuote(tasks) {
  const { data, error } = await supabase.from("job_tasks").insert(tasks);

  if (error) throw new Error(error.message);

  return data;
}

export const useCreateJobTasksFromQuote = () =>
  useMutation((tasks) => createJobTasksFromQuote(tasks), {
    onSuccess: (data) => data,
    onError: (error) => error,
    mutationFn: createJobTasksFromQuote,
  });
