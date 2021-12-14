import { CheckIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { Input, TextArea, Dropdown, Address, Tabs, Button, ConfirmationDialog } from "../../common";
import { QuotesApi, JobsApi } from "../../api";
import supabase from "../../api/supabase";

export const ApproveQuote = ({ quoteId, status, quotePayload }) => {
  const user = supabase.auth.user();
  const [state, setState] = useState({
    approvedBy: user?.user_metadata?.name || "",
    clientApproved: "",
    description: "",
    status: "Approved",
  });
  const updateApproveStatus = QuotesApi.useUpdateQuoteStatus(quoteId, state);
  const createJobFromQuote = QuotesApi.useCreateJobFromQuote();
  const createJobTasksFromQuote = QuotesApi.useCreateJobTasksFromQuote();

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    setState({
      ...state,
      [id]: value,
    });
  };

  return (
    <ConfirmationDialog
      isDone={createJobTasksFromQuote.isSuccess}
      icon="info"
      title="Approve Quote"
      body="Are you sure you wish to approve this quote? This action will create a job with a list of tasks."
      triggerButton={
        <button
          type="button"
          id={quoteId}
          className={
            status !== "Approved" && status !== "Rejected"
              ? `ml-3 inline-flex items-center text-sm font-medium focus:outline-none hover:text-green-400`
              : "ml-3 inline-flex items-center text-sm text-gray-200"
          }
          disabled={status === "Approved" || status === "Rejected"}
        >
          <CheckIcon
            className={
              status !== "Approved" && status !== "Rejected"
                ? "-ml-0.5 mr-2 h-4 w-4 text-green-400"
                : "-ml-0.5 mr-2 h-4 w-4 text-green-100"
            }
            aria-hidden="true"
          />
          Approve
        </button>
      }
      confirmButton={
        <Button
          isLoading={updateApproveStatus?.isLoading}
          variant="approve"
          onClick={async (e) => {
            try {
              if (quotePayload.quote_type === "Variation" && quotePayload.variation_job_id) {
                console.log("INSIDE VARIATION")
                // Just create tasks
                const quoteLines = quotePayload?.quote_lines;
                const formatTaskPayload = quoteLinesToJobTasks(
                  quoteLines,
                  quotePayload.variation_job_id,
                  "Variation",
                  quotePayload.id,
                );
                const createTasksResult = await createJobTasksFromQuote.mutateAsync(
                  formatTaskPayload,
                );
                await updateApproveStatus.mutateAsync();
              } else {
                console.log('INSIDE CREATE JOB')
                const fields = [
                  [quotePayload.street_1],
                  [quotePayload.street_2],
                  [quotePayload.city],
                ];
                const addressFormat = fields
                  .map((part) => part.filter(Boolean).join(" "))
                  .filter((str) => str.length)
                  .join(", ");
                const jobPayload = {
                  client_id: quotePayload?.client,
                  site: addressFormat || "",
                  quote_id: quoteId || null,
                  start_date: "",
                  end_date: "",
                  job_status: "Pending Handover",
                  status: "Active",
                };

                await updateApproveStatus.mutateAsync();
                const createdJob = await createJobFromQuote.mutateAsync(jobPayload);

                const quoteLines = quotePayload?.quote_lines;
                if (quoteLines?.length && createdJob?.id) {
                  const formatTaskPayload = quoteLinesToJobTasks(quoteLines, createdJob.id);
                  const createTasksResult = await createJobTasksFromQuote.mutateAsync(
                    formatTaskPayload,
                  );
                }
              }
            } catch (err) {
              console.log("ERROR APPROVING: ", err);
            }
          }}
        >
          Approve
        </Button>
      }
    >
      <div className="flex">
        <div className="w-1/2">
          <Input
            title="Approved By"
            id="approvedBy"
            type="text"
            value={state.approvedBy}
            handleChange={handleInputChange}
          />
        </div>
        <div className="w-1/2">
          <Input
            title="Client Who Approved"
            id="clientApproved"
            type="text"
            value={state.clientApproved}
            handleChange={handleInputChange}
          />
        </div>
      </div>
      <TextArea
        title="Confirmation Text"
        id="description"
        type="text"
        value={state.description}
        handleChange={handleInputChange}
      />
    </ConfirmationDialog>
  );
};

function quoteLinesToJobTasks(lines, jobId, type = "New", quoteId = null) {
  return lines.map((line) => ({
    job_id: jobId,
    task_type: type,
    zone: line.zone,
    zone_label: line.zone_label,
    type: line.type,
    description: line.description,
    total_hours: (line.erect_dismantle / 60).toFixed(2),
    variation_quote_id: quoteId
  }));
}
