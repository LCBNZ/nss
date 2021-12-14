/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import { SideModal, Input, TextArea, Dropdown, Address, DateSelect } from "../../common";

import { useClients } from "../../api/Clients";
import { useStaff } from "../../api/Staff";
import { useCreateJob, useUpdateJob, fetchJob } from "../../api/Jobs";

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

export function JobForm({ heading, open, setOpen, formType = "create" }) {
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

  const createJobMutation = useCreateJob(jobPayload);
  const updateJobMutation = useUpdateJob();

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
          client_id: job?.client_id || "",
          site: job?.site || "",
          start_date: job?.start_date ? job?.start_date : "",
          end_date: job?.end_date ? job?.end_date : "",
          truck_driver: job?.truck_driver || "",
          supervisor: job?.supervisor || "",
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
            status,
          } = values;
          const jobPayload = {
            client_id,
            site,
            start_date: start_date ? moment(start_date).format("DD/MM/YYYY") : "",
            end_date: end_date ? moment(end_date).format("DD/MM/YYYY") : "",
            truck_driver,
            supervisor,
            job_status,
            status,
          };
          // createJobMutation.mutate();
          // setOpen(false);
          try {
            if (formType === "create") {
              await createJobMutation.mutateAsync(jobPayload);
            } else {
              await updateJobMutation.mutateAsync({
                job: jobPayload,
                jobId,
              });
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
                label="Truck Driver"
                id="truck_driver"
                value={values.truck_driver}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={staffData.isLoading}
                options={renderStaffList()}
              />
              <Dropdown
                label="Supervisor"
                id="supervisor"
                value={values.supervisor}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={staffData.isLoading}
                options={renderStaffList()}
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
