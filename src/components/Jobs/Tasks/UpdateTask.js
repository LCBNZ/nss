/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { SideModal, Input, TextArea, Dropdown, Spinner } from "../../../common";

import { JobsApi } from "../../../api";

const typeOptions = [
  { value: "Scaffolding", label: "Scaffolding" },
  { value: "Stairs", label: "Stairs" },
  { value: "Roof", label: "Roof" },
  { value: "Propping", label: "Propping" },
  { value: "Edge Protection", label: "Edge Protection" },
  { value: "Shrinkwrap", label: "Shrinkwrap" },
  { value: "Geda 1200", label: "Geda 1200" },
];

export function UpdateTask({ taskId, jobId, open, setOpen }) {
  const updateTaskMutation = JobsApi.useUpdateTask();

  const tasksQuery = JobsApi.useFetchTask(taskId);

  if (tasksQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tasksQuery.data) return null;

  return (
    <div>
      <Formik
        initialValues={{
          zone: tasksQuery.data.zone || "",
          zone_label: tasksQuery.data.zone_label || "",
          type: tasksQuery.data.type || "",
          description: tasksQuery.data.description || "",
          total_hours: tasksQuery.data.total_hours || "",
        }}
        onSubmit={async (values, { resetForm }) => {
          const hours = Number(values.total_hours);
          const fixed = hours.toFixed(2);
          const taskPayload = {
            job_id: Number(jobId),
            zone: values.zone,
            zone_label: values.zone_label,
            type: values.type,
            description: values.description,
            total_hours: String(fixed),
          };

          try {
            await updateTaskMutation.mutateAsync({ payload: taskPayload, taskId });

            setOpen(false);
            resetForm();
          } catch (err) {
            console.log("ERROR CREATING JOB", err);
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
            heading="Update Task"
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmit}
            isLoading={isSubmitting}
            formType="edit"
          >
            <div className="flex items-center">
              <Input
                title="Zone"
                id="zone"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.zone}
              />
              <Input
                title="Zone Label"
                id="zone_label"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.zone_label}
              />
            </div>
            <div className="w-1/2">
              <Dropdown
                label="Type"
                id="type"
                options={typeOptions}
                value={values.type}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
            </div>

            <div className="">
              <TextArea
                title="Description"
                id="description"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.description}
              />
            </div>

            <div className="flex w-1/2">
              <Input
                title="Total Hours"
                id="total_hours"
                type="number"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.total_hours}
              />
            </div>
          </SideModal>
        )}
      </Formik>
    </div>
  );
}
