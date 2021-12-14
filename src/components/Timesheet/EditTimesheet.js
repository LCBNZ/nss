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

import { TimesheetsApi, StaffApi, JobsApi } from "../../api";

export function EditTimesheet({ heading, open, setOpen, formType = "create" }) {
  const history = useHistory();
  const { timesheetId } = useParams();
  const [timesheet, setTimesheet] = useState([]);
  const [payload, setPayload] = useState({});
  const updateTimesheetMutation = TimesheetsApi.useUpdateTimesheet();
  const staffQuery = StaffApi.useStaff();
  const jobQuery = JobsApi.useJobs();

  useEffect(() => {
    let isCurrent = true;

    if (!open && timesheetId) {
      history.goBack();
    }

    if (timesheetId) {
      TimesheetsApi.fetchTimesheet(timesheetId).then((timesheetData) => {
        console.log("timesheetData", timesheetData);
        if (isCurrent) setTimesheet(timesheetData);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [timesheetId, open]);

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

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Declined", label: "Declined" },
  ];

  if (timesheetId && !timesheet.id)
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div>
      <Formik
        initialValues={{
          date: timesheet?.date,
          staff_id: timesheet?.staff_id || null,
          job_id: timesheet?.job_id || null,
          time_on: timesheet?.time_on || null,
          time_off: timesheet?.time_off || "",
          comments: timesheet?.comments || "",
          status: timesheet?.status || "Pending",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const timesheetPayload = {
            date: values.date,
            staff_id: values.staff_id,
            job_id: values.job_id,
            time_on: values.time_on,
            time_off: values.time_off,
            comments: values.comments,
            status: values.status,
          };

          try {
            const result = await updateTimesheetMutation.mutateAsync({
              timesheet: timesheetPayload,
              timesheetId,
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
            <div>
              <DateSelect title="Date" id="date" value={values.date} onChange={setFieldValue} />
            </div>
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
                label="Job"
                id="job_id"
                value={values.job_id}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={jobQuery.isLoading}
                options={renderJobList()}
              />
            </div>
            <div className="flex items-center">
              <TimeSelect
                title="Start Time"
                id="time_on"
                value={moment(values.time_on, "HH:mm").toDate()}
                onChange={setFieldValue}
              />
              <TimeSelect
                title="Finish Time"
                id="time_off"
                value={values.time_off ? moment(values.time_off, "HH:mm").toDate() : null}
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
            <div className="w-1/2">
              <Dropdown
                label="Status"
                id="status"
                options={statusOptions}
                value={values.status}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
            </div>
          </SideModal>
        )}
      </Formik>
    </div>
  );
}
