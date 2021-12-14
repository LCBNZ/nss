import React from "react";
import axios from "axios";
import { CheckIcon } from "@heroicons/react/outline";
import { ConfirmationDialog, Button, Dropdown, DateSelect } from "../../common";
import { StaffApi, InvestigationsApi } from "../../api";
import { useNotificationStore } from "../../store/notifications";

import supabase from "../../api/supabase";

export const AssignStaff = ({ staffId, staff, email, leaveId, start, end, type, comments }) => {
  console.log("staffId >>> ", staffId, type);
  const [isDone, setIsDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { addNotification } = useNotificationStore();
  const updateReport = InvestigationsApi.useUpdateInvestigation()
  const staffData = StaffApi.useStaff();

    const renderStaffList = () => {
      if (staffData?.data && staffData?.data?.length > 0) {
        return staffData.data.map((staff) => ({
          label: staff.staff_name,
          value: staff.id,
        }));
      }
      return [];
    };



  return (
    <ConfirmationDialog
      isDone={isDone}
      icon="info"
      title="Assign Staff"
      size="2xl"
      triggerButton={
        <Button variant="approveInverse" size="xs">
          Approve
        </Button>
      }
      confirmButton={
        <Button
          isLoading={isLoading}
          variant="approve"
          onClick={async (e) => {
            // setIsLoading(true);
            // const loggedInuser = await supabase.auth.user();
            // const approvedBy = loggedInuser?.user_metadata?.name;
            // const title = `Your leave request has been approved`;
            // const body = formatBody(staff, start, end, approvedBy);
            // try {
            //   const result = await axios.post(
            //     "https://scaff-m8-server.herokuapp.com/api/process-email",
            //     {
            //       title,
            //       body,
            //       emailTo: email,
            //     },
            //   );
            //   console.log("RESULT >>> ", result);
            //   const status = result?.status;
            //   addNotification({
            //     isSuccess: status === 200 ? true : false,
            //     heading:
            //       status === 200 ? "Successfully dispatched email" : "Failed to dispatch email",
            //     content:
            //       status === 200
            //         ? "Sent email to recipient."
            //         : "There was an error dispatching email",
            //   });
            // } catch (err) {
            //   console.log("ERROR >>>> ", err);
            //   addNotification({
            //     isSuccess: false,
            //     heading: "Failed to dispatch email",
            //     content: "There was an error dispatching email",
            //   });
            // }
            // try {
            //   await updateLeave.mutateAsync({
            //     leave: {
            //       status: "Approved",
            //       approved_by: approvedBy,
            //     },
            //     leaveId,
            //   });
            // } catch (err) {
            //   console.log("ERROR APPROVING");
            // }
            // const days = enumerateDaysBetweenDates(start, end);
            // console.log("days >>>>>>> ", days);
            // console.log("TIMESHEETS >>>> ", timesheets)
            // try {
            //   await createTimesheets.mutateAsync(timesheets);
            // } catch(err) {
            //   console.log("ERROR CREATING TIMESHEETS >>>> ", err)
            // }
            // setIsLoading(false);
            // setIsDone(true);
          }}
        >
          Approve
        </Button>
      }
    >
      <div className="mb-12">
        <div className="flex items-center">
          <Dropdown
            label="Assign To"
            onChange={(value) => console.log("Selected Val", value)}
            onBlur={() => console.log("blur")}
            isLoading={staffData.isLoading}
            options={renderStaffList()}
            classes="h-16"
          />
          <DateSelect
            title="Start Date"
            id="start_date"
            // value={values.start_date}
            onChange={(value) => console.log("date val", value)}
          />
        </div>
        <div className="pt-32">
          <p className="text-sm text-gray-500">
            An email will be sent to the selected staff member alerting them they have been assigned
            to this issue.
          </p>
        </div>
      </div>
    </ConfirmationDialog>
  );
};

