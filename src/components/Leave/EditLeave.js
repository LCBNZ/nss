import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { Formik } from "formik";
import {
  SideModal,
  Input,
  Dropdown,
  Address,
  Spinner,
  DateSelect,
  TextArea,
  TimeSelect,
} from "../../common";

import { LeaveApi, StaffApi, JobsApi } from "../../api";

export function EditLeaveForm({ heading, open, setOpen, formType = "create" }) {
  const history = useHistory();
  const { leaveId } = useParams();
  const [leave, setLeave] = useState([]);

  const updateLeaveMutation = LeaveApi.useUpdateLeave();
  const staffQuery = StaffApi.useStaff();
  const jobQuery = JobsApi.useJobs();

  useEffect(() => {
    let isCurrent = true;

    if (!open && leaveId) {
      history.goBack();
    }

    if (leaveId) {
      LeaveApi.fetchLeave(leaveId).then((leaveData) => {
        console.log("timesheetData", leaveData);
        if (isCurrent) setLeave(leaveData);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [leaveId, open]);

  const renderStaffList = () => {
    if (staffQuery?.data && staffQuery?.data?.length > 0) {
      return staffQuery.data.map((staff) => ({
        label: staff.staff_name,
        value: staff.id,
      }));
    }
    return [];
  };

  const renderJobList = () => {
    if (jobQuery && jobQuery?.data?.length > 0) {
      return jobQuery.data.map((job) => ({
        label: `${job.id + 1000} - ${job.site}`,
        value: job.id,
      }));
    }
    return [];
  };

  const leaveOptions = [
    { value: "Annual", label: "Annual" },
    { value: "Sick", label: "Sick" },
    { value: "Bereavement", label: "Bereavement" },
    { value: "Leave Without Pay", label: "Leave Without Pay" },
    { value: "Other", label: "Other" },
  ];

  if (leaveId && !leave.id)
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div>
      <Formik
        initialValues={{
          start_date: leave.start_date ? moment(leave.start_date, "DD/MM/YYYY").toDate() : null,
          end_date: leave.end_date ? moment(leave.end_date, "DD/MM/YYYY").toDate() : null,
          staff_id: leave?.staff_id || null,
          type: leave.type || "",
          comments: leave.comments || "",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const leavePayload = {
            start_date: values.start_date
              ? moment(values.start_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            end_date: values.end_date
              ? moment(values.end_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            staff_id: values.staff_id,
            type: values.type,
            comments: values.comments,
          };

          try {
            const result = await updateLeaveMutation.mutateAsync({
              leave: leavePayload,
              leaveId,
            });

            setOpen(false);
            resetForm();
          } catch (err) {
            console.log("ERROR CREATING STAFF");
          }
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        }) => (
          <SideModal
            heading={heading}
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmit}
            isLoading={isSubmitting}
            formType={formType}
          >
            {/* <pre>
              <code>{JSON.stringify(values, null, 2)}</code>
            </pre> */}
            <div className="flex items-center">
              <Dropdown
                label="Staff"
                id="staff_id"
                value={values.staff_id}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={jobQuery.isLoading}
                options={renderStaffList()}
              />
              <Dropdown
                label="Leave Type"
                id="type"
                options={leaveOptions}
                value={values.type}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
            </div>
            <div className="flex items-center">
              <DateSelect
                title="Start Date"
                id="start_date"
                value={values.start_date}
                onChange={setFieldValue}
              />
              <DateSelect
                title="Finish Date"
                id="end_date"
                value={values.end_date}
                onChange={setFieldValue}
              />
            </div>
            <div>
              <TextArea
                title="Comments"
                id="comments"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.comments}
              />
            </div>
          </SideModal>
        )}
      </Formik>
    </div>
  );
}
