/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import {
  SideModal,
  Input,
  TextArea,
  Dropdown,
  TimeSelect,
  Address,
  DateSelect,
} from "../../common";

import { fetchVisit, useUpdateVisit } from "../../api/Visits";
import { useClients } from "../../api/Clients";
import { useStaff } from "../../api/Staff";
import { useJobs } from "../../api/Jobs";
import { Tasks } from "./EditTasks";
import { EditStaff } from "./Staff/EditStaff";
import { EditVehicle } from "./EditVehicles";

const riskOptions = [
  { value: "Low", label: "Low" },
  { value: "Med", label: "Med" },
  { value: "High", label: "High" },
];

const typeOptions = [
  { value: "Install", label: "Install" },
  { value: "Dismantle", label: "Dismantle" },
  { value: "Variation", label: "Variation" },
  { value: "Remedial", label: "Remedial" },
];

const swmsOptions = [
  { value: "Standard SWMS (Green Scaffold)", label: "Standard SWMS (Green Scaffold)" },
  { value: "Live Edge (Yellow)", label: "Live Edge (Yellow)" },
  { value: "Hanging Scaffold (Yellow)", label: "Hanging Scaffold (Yellow)" },
  {
    value: "Hanging Scaffold / Confined Space (Red)",
    label: "Hanging Scaffold / Confined Space (Red)",
  },
  { value: "GM / OM Approved", label: "GM / OM Approved" },
  { value: "Other", label: "Other" },
];

const visitStatusOptions = [
  { value: "Pending Prestart", label: "Pending Prestart" },
  { value: "Pending Close of Visit", label: "Pending Close of Visit" },
  { value: "Completed", label: "Completed" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function EditVisit({ id = "", heading, open, setOpen, formType = "create" }) {
  const [visit, setVisit] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const history = useHistory();
  const { visitId } = useParams();

  useEffect(() => {
    let isCurrent = true;

    if (!open && (visitId || id)) {
      history.goBack();
    }

    if (visitId || id) {
      fetchVisit(visitId || id).then((visitData) => {
        if (isCurrent) setVisit(visitData);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [visitId, id, open]);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const updateVisitMutation = useUpdateVisit();

  const staffData = useStaff();
  const jobData = useJobs();

  const renderStaffList = () => {
    if (staffData?.data && staffData?.data?.length > 0) {
      return staffData.data.map((staff) => ({
        label: staff.staff_name,
        value: staff.id,
      }));
    }
    return [];
  };

  const renderJobList = () => {
    if (jobData?.data && jobData?.data?.length > 0) {
      return jobData.data.map((job) => ({
        label: `${job.id + 1000} - ${job?.site}`,
        value: job.id,
      }));
    }
    return [];
  };
  if ((visitId || id) && !visit.id) {
    return <div />;
  }
  return (
    <div>
      <Formik
        initialValues={{
          date: visit.date,
          job_id: visit.job_id,
          team_leader_id: visit.team_leader_id,
          risk: visit.risk,
          type: visit.type,
          swms_document: visit.swms_document,
          notes: visit.notes,
          comments: visit.comments,
          staff_ids: visit.staff_ids,
          staff_labels: visit.staff_labels,
          task_ids: visit.task_ids,
          task_labels: visit.task_labels,
          start_time: visit.start_time || "",
          vehicle_ids: visit.vehicle_ids,
          vehicle_labels: visit.vehicle_labels,
          visit_status: visit.visit_status,
          status: visit.status,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.start_time) {
            errors.start_time = "Start Time is required.";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const visitPayload = {
            date: values.date ? moment(values.date, "DD/MM/YYYY").format("DD/MM/YYYY") : "",
            job_id: values.job_id,
            team_leader_id: values.team_leader_id,
            risk: values.risk,
            type: values.type,
            swms_document: values.swms_document,
            notes: values.notes,
            comments: values.comments,
            staff_ids: values.staff_ids,
            staff_labels: values.staff_labels,
            task_ids: values.task_ids,
            task_labels: values.task_labels,
            start_time: values.start_time,
            vehicle_ids: values.vehicle_ids,
            vehicle_labels: values.vehicle_labels,
            visit_status: values.visit_status,
            status: values.status,
          };
          try {
            const res = await updateVisitMutation.mutateAsync({
              visitId: visitId || id,
              visit: visitPayload,
              leader: values?.team_leader_id || "",
            });
            console.log("RES", res);
          } catch (err) {
            console.log("ERROR", err);
          }
          setOpen(false);
          // resetForm();
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
            <div className="flex items-center">
              <DateSelect title="Date" id="date" value={values.date} onChange={setFieldValue} />
              <Dropdown
                label="Job"
                id="job_id"
                value={values.job_id}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={jobData.isLoading}
                options={renderJobList()}
              />
            </div>

            <div className="flex items-center">
              <Dropdown
                label="Team Leader"
                id="team_leader_id"
                value={values.team_leader_id}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={staffData.isLoading}
                options={renderStaffList()}
              />
              <Dropdown
                label="Risk"
                id="risk"
                value={values.risk}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={riskOptions}
              />
            </div>
            <EditStaff setFieldValue={setFieldValue} values={values?.staff_ids} />

            <div className="flex items-center">
              <EditVehicle setFieldValue={setFieldValue} values={values?.vehicle_ids} />
            </div>
            <TimeSelect
              title="Start Time"
              id="start_time"
              value={values.start_time ? moment(values.start_time, "HH:mm").toDate() : null}
              onChange={setFieldValue}
              error={errors.start_time}
            />
            {/* <div className="flex items-center">
              <div className="w-full px-4 py-4">
                {" "}
                <label
                  id="staff"
                  htmlFor="staff"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Staff
                </label>
                <Select
                  // defaultValue={[renderStaffList()[2], renderStaffList()[3]]}
                  isMulti
                  name="staff"
                  id="staff"
                  options={renderStaffList()} // staff_ids.includes(option.value)
                  value={renderStaffList().filter((option) =>
                    values?.staff_ids?.includes(option.value),
                  )}
                  onChange={(value) => {
                    console.log("VALUE", value);
                    const staffVals = value.map((item) => String(item.value));
                    const staffLabels = value.map((item) => String(item.label));
                    setFieldValue("staff_ids", staffVals);
                    setFieldValue("staff_labels", staffLabels);
                  }}
                  className="w-full basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
            </div> */}
            <div className="flex items-center">
              <Dropdown
                label="Type"
                id="type"
                value={values.type}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={typeOptions}
              />
              <Dropdown
                label="SWMS / Task Analysis Document"
                id="swms_document"
                value={values.swms_document}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={swmsOptions}
              />
            </div>
            {values.job_id && (
              <Tasks jobId={values.job_id} setFieldValue={setFieldValue} values={values} />
            )}
            <TextArea
              title="Notes"
              id="notes"
              type="text"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.notes}
            />

            <Input
              title="Comment"
              id="comment"
              type="text"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.comment}
            />

            <div className="flex items-center">
              <Dropdown
                label="Visit Status"
                id="visit_status"
                value={values.visit_status}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={visitStatusOptions}
              />
              <Dropdown
                label="Active / Inactive"
                id="status"
                value={values.status}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={statusOptions}
              />
            </div>
          </SideModal>
        )}
      </Formik>
    </div>
  );
}
