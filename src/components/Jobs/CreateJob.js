/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import { SideModal, Input, TimeSelect, Dropdown, Address, DateSelect } from "../../common";

import { useClients } from "../../api/Clients";
import { useStaff } from "../../api/Staff";
import { useCreateJob, useUpdateJob, fetchJob } from "../../api/Jobs";
import { useCreateVisit } from "../../api/Visits";

const statusOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Install In Progress", label: "Install In Progress" },
  { value: "Install Complete", label: "Install Complete" },
  { value: "Variation In Progress", label: "Variation In Progress" },
  { value: "Variation Complete", label: "Variation Complete" },
  { value: "Dismantle In Progress", label: "Dismantle In Progress" },
  { value: "Dismantle Complete", label: "Dismantle Complete" },
  { value: "Job Complete", label: "Job Complete" },
  { value: "Admin Complete", label: "Admin Complete" },
  { value: "Pending Handover", label: "Pending Handover" },
];


export function CreateJob({ heading, open, setOpen, formType = "create" }) {
  const [jobPayload, setJobPayload] = useState({});
  const clientData = useClients();
  const staffData = useStaff();

  const createJobMutation = useCreateJob(jobPayload);
  const createVisitMutation = useCreateVisit();

  const renderClientList = () => {
    if (clientData?.data && clientData?.data?.length > 0) {
      return clientData.data.map((client) => ({
        label: client.client_name,
        value: client.id,
      }));
    }
    return [];
  };

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
    <div>
      <Formik
        initialValues={{
          client_id: null,
          site: "",
          start_date: "",
          end_date: "",
          truck_driver: null,
          supervisor: null,
          job_status: "",
          status: "Active",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const {
            client_id,
            site,
            start_date,
            end_date,
            truck_driver,
            supervisor,
            staff_ids,
            staff_labels,
            job_status,
            status,
          } = values;

          const start = moment(start_date).format("DD/MM/YYYY");
          const end = moment(end_date).format("DD/MM/YYYY");
          const dateList = enumerateDaysBetweenDates(start, end);

          let visitsCreated;

          if (start_date && end_date) {
            visitsCreated = true;
          } else {
            visitsCreated = false;
          }

          const jobPayload = {
            client_id,
            site,
            start_date: start_date ? moment(start_date).format("DD/MM/YYYY") : "",
            end_date: end_date ? moment(end_date).format("DD/MM/YYYY") : "",
            truck_driver,
            supervisor,
            job_status,
            staff_ids,
            staff_labels,
            visits_created: visitsCreated,
            status,
          };

          try {
            const jobRes = await createJobMutation.mutateAsync(jobPayload);
            const jobId = jobRes?.[0]?.id;

            if (start_date && end_date) {
              const visits = dateList.map((date) => ({
                date,
                job_id: jobId,
                team_leader_id: supervisor,
                staff_ids,
                staff_labels,
                visit_status: "Pending Prestart",
                status: "Active",
              }));
              const visitRes = await createVisitMutation.mutateAsync(visits);
            }
          } catch (err) {
            console.log("ERROR CREATING JOB", err);
          }

          setSubmitting(false);
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
            <div className="flex w-1/2">
              <Dropdown
                label="Client"
                id="client_id"
                value={values.client_id}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={clientData.isLoading}
                options={renderClientList()}
              />
            </div>

            <Input
              title="Site"
              id="site"
              type="text"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.site}
              error={errors.site}
            />
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
          
            <div className="w-1/2">
              <Dropdown
                label="Status"
                id="job_status"
                value={values.job_status}
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
