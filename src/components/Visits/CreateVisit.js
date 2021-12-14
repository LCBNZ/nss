/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

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

import { useCreateVisit } from "../../api/Visits"
import { useClients } from "../../api/Clients";
import { useStaff } from "../../api/Staff";
import { useJobs } from "../../api/Jobs";
import { useVehicles } from "../../api/Vehicles";
import { Tasks } from "./Tasks";

const statusOptions = [{ value: "Admin", label: "Admin" }];

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

export function CreateVisit({ heading, open, setOpen, formType = "create", jobId = null }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  console.log("JOB ID >>>>>> ", jobId);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const createVisitMutation = useCreateVisit();

  const staffData = useStaff();
  const vehicleData = useVehicles();
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

    const renderVehicleList = () => {
      if (vehicleData?.data && vehicleData?.data?.length > 0) {
        return vehicleData.data.map((vehicle) => ({
          label: `${vehicle?.rego} - ${vehicle?.make} ${vehicle?.model}`,
          value: vehicle.id,
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
  return (
    <div>
      <Formik
        initialValues={{
          job_id: jobId || "",
          team_leader_id: "",
          risk: "",
          type: "",
          swms_document: "",
          notes: "",
          comments: "",
          staff_ids: [],
          staff_labels: [],
          task_ids: [],
          task_labels: [],
          start_time: "",
          vehicle_ids: [],
          vehicle_labels: [],
        }}
        validate={(values) => {
          const errors = {};
          if (!values.start_time) {
            errors.start_time = "Start Time is required.";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const start = moment(startDate).format("DD/MM/YYYY");
          const end = moment(endDate).format("DD/MM/YYYY");
          const dateList = enumerateDaysBetweenDates(start, end);

          const result = dateList.map((date) => ({
            date,
            job_id: values.job_id || null,
            team_leader_id: values.team_leader_id || null,
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
            visit_status: "Pending Prestart",
            status: "Active",
          }));

          try {
            const res = await createVisitMutation.mutateAsync(result);
          } catch (err) {
            console.log("ERROR", err);
          }

          setOpen(false);
          resetForm();
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
              <div className="w-full px-4 py-4">
                <label
                  htmlFor="daterange"
                  id="daterange"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start to Finish
                </label>
                <DatePicker
                  id="daterange"
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  className="w-full text-xs border-gray-300 rounded-md shadow-sm"
                  // inline
                />
              </div>
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

            <div className="flex items-center">
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
                  // defaultValue={[colourOptions[2], colourOptions[3]]}
                  isMulti
                  name="staff"
                  id="staff"
                  options={renderStaffList()}
                  onChange={(value) => {
                    const staffVals = value.map((item) => String(item.value));
                    const staffLabels = value.map((item) => String(item.label));
                    setFieldValue("staff_ids", staffVals);
                    setFieldValue("staff_labels", staffLabels);
                  }}
                  className="w-full basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full px-4 py-4">
                {" "}
                <label
                  id="vehicles"
                  htmlFor="vehicles"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Vehicles
                </label>
                <Select
                  isMulti
                  name="vehicles"
                  id="vehicles"
                  options={renderVehicleList()}
                  onChange={(value) => {
                    const vehicleIds = value.map((item) => String(item.value));
                    const vehicleLabels = value.map((item) => String(item.label));
                    setFieldValue("vehicle_ids", vehicleIds);
                    setFieldValue("vehicle_labels", vehicleLabels);
                  }}
                  className="w-full basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
            </div>
            <div className="w-1/2">
              <TimeSelect
                title="Start Time"
                id="start_time"
                value={values.start_time ? moment(values.start_time, "HH:mm").toDate() : null}
                onChange={setFieldValue}
                error={errors.start_time}
              />
            </div>

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
            {values.job_id && <Tasks jobId={values.job_id} setFieldValue={setFieldValue} />}
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
          </SideModal>
        )}
      </Formik>
    </div>
  );
}

function enumerateDaysBetweenDates(startDate, endDate) {
  const end = moment(endDate, "DD/MM/YYYY");
  const start = moment(startDate, "DD/MM/YYYY");
  const result = [moment({ ...start })];

  if (end.diff(start, "days") >= 0) {
    while (end.date() !== start.date()) {
      start.add(1, "day");
      result.push(moment({ ...start }));
    }
  }

  return result.map((x) => x.format("DD/MM/YYYY"));
}
