/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import { SideModal, Input, TextArea, Dropdown, Address, DateSelect } from "../../common";
import {statusOptions} from "../../utils"

import { useClients } from "../../api/Clients";
import { useStaff } from "../../api/Staff";
import { useCreateJob, useUpdateJob, fetchJob } from "../../api/Jobs";
import { useCreateVisit } from "../../api/Visits";
import { EditStaff } from "./Staff/EditStaff";

const jobStatusOptions = [
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

export function EditJobForm({ heading, open, setOpen, formType = "create" }) {
  const [job, setJob] = useState([]);
  const [jobPayload, setJobPayload] = useState({});
  const clientData = useClients();
  const staffData = useStaff();

  const history = useHistory();
  const { jobId } = useParams();

  useEffect(() => {
    let isCurrent = true;

    if (!open && jobId) {
      history.goBack();
    }

    if (jobId) {
      fetchJob(jobId).then((jobData) => {
        if (isCurrent) setJob(jobData);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [jobId, open]);

  const updateJobMutation = useUpdateJob();
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
  return jobId && !job.id ? (
    <div>loading...</div>
  ) : (
    <div>
      <Formik
        initialValues={{
          client_id: job?.client_id || null,
          site: job?.site || "",
          start_date: job?.start_date ? job?.start_date : "",
          end_date: job?.end_date ? job?.end_date : "",
          truck_driver: job?.truck_driver || null,
          supervisor: job?.supervisor || null,
          staff_ids: job.staff_ids || "",
          staff_labels: job.staff_labels || "",
          job_status: job?.job_status || "",
          status: job?.status || "Active",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const {
            client_id,
            site,
            start_date,
            end_date,
            truck_driver,
            supervisor,
            job_status,
            staff_ids,
            staff_labels,
            visits_created,
            status,
          } = values;

          const startDate = start_date ? moment(start_date, "DD/MM/YYYY").format("DD/MM/YYYY") : "";
          const endDate = end_date ? moment(end_date, "DD/MM/YYYY").format("DD/MM/YYYY") : "";

          let visitsCreated;

          if (startDate && endDate) {
            visitsCreated = true;
          } else {
            visitsCreated = false;
          }

          const jobPayload = {
            client_id,
            site,
            start_date: startDate,
            end_date: endDate,
            truck_driver,
            supervisor,
            staff_ids: staff_ids || [],
            staff_labels: staff_labels || [],
            visits_created: visitsCreated,
            job_status,
            status,
          };
          console.log("jobPayload", jobPayload);
          try {
            await updateJobMutation.mutateAsync({
              job: jobPayload,
              jobId,
            });
            if (job.visits_created === false && startDate && endDate) {
              const dateList = enumerateDaysBetweenDates(startDate, endDate);

              const visits = dateList.map((date) => ({
                date,
                job_id: job.id,
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
            <div className="flex items-center">
              <Dropdown
                label="Job Status"
                id="job_status"
                value={values.job_status}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={jobStatusOptions}
              />
              <Dropdown
                label="Status"
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
