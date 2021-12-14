import { XIcon } from "@heroicons/react/outline";
import { ConfirmationDialog, Button } from "../../common";
import { QuotesApi } from "../../api";

export const DeclineQuote = ({ quoteId, status }) => {
  const updateApproveStatus = QuotesApi.useUpdateQuoteStatus(quoteId, "Rejected");

  return (
    <ConfirmationDialog
      isDone={updateApproveStatus.isSuccess}
      icon="danger"
      title="Decline Quote"
      body="Are you sure you wish to decline this quote?"
      triggerButton={
        <button
          type="button"
          id={quoteId}
          className={
            status !== "Approved" && status !== "Rejected"
              ? "ml-3 inline-flex items-center text-sm font-medium focus:outline-none hover:text-red-400"
              : "ml-3 inline-flex items-center text-sm text-gray-200"
          }
          disabled={status === "Approved" || status === "Rejected"}
        >
          <XIcon
            className={
              status !== "Approved" && status !== "Rejected"
                ? "-ml-0.5 mr-2 h-4 w-4 text-red-400"
                : "-ml-0.5 mr-2 h-4 w-4 text-red-100"
            }
            aria-hidden="true"
          />
          Decline
        </button>
      }
      confirmButton={
        <Button
          isLoading={updateApproveStatus?.isLoading}
          variant="danger"
          onClick={async (e) => {
            try {
              await updateApproveStatus.mutateAsync({ quoteId, status: "Rejected" });
            } catch (err) {
              console.log("ERROR APPROVING: ", err);
            }
          }}
        >
          Decline
        </Button>
      }
    />
  );
};
