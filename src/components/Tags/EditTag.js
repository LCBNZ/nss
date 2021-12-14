/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import { SideModal, Input, TextArea, Dropdown, Address, DateSelect } from "../../common";

import { TagsApi, JobsApi } from "../../api";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function EditTagForm({ heading, open, setOpen, formType = "edit" }) {
  const [tag, setTag] = useState([]);

  const history = useHistory();
  const { tagId } = useParams();

  const updateTagMutation = TagsApi.useUpdateTag();
  const jobData = JobsApi.useJobs();

  useEffect(() => {
    let isCurrent = true;

    if (!open && tagId) {
      history.goBack();
    }

    if (tagId) {
      TagsApi.fetchTag(tagId).then((tagData) => {
        if (isCurrent) setTag(tagData);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [tagId, open]);

  if (tagId && !tag.id) {
    return <div />;
  }

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
          job_id: tag.job_id || "",
          tag_no: tag.tag_no || "",
          description: tag.description || "",
          last_inspection: tag.last_inspection || "",
          inspection_due: tag.inspection_due || "",
          status: tag.status || "Active",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.tag_no) {
            errors.tag_no = "Tag # is required.";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const tagPayload = {
            job_id: values.job_id || null,
            tag_no: values.tag_no || "",
            description: values.description || "",
            last_inspection: values.last_inspection
              ? moment(values.last_inspection, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            inspection_due: values.inspection_due
              ? moment(values.inspection_due, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            status: values.status,
          };
          try {

            await updateTagMutation.mutateAsync({
              tag: tagPayload,
              tagId,
            });
          } catch (err) {
            console.log("ERROR", err)
          }
          setOpen(false);
          setSubmitting(false);
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
            {/* <pre>
              <code>{JSON.stringify(values, null, 2)}</code>
            </pre> */}
            <div className="flex">
              <Input
                title="Tag #"
                id="tag_no"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.tag_no}
                error={errors.tag_no}
              />
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

            <div>
              <TextArea
                title="Description"
                id="description"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.description}
              />
            </div>

            <div className="flex items-center">
              <DateSelect
                title="Last Inspection"
                id="last_inspection"
                value={values.last_inspection}
                onChange={setFieldValue}
              />
              <DateSelect
                title="Inspection Due"
                id="inspection_due"
                value={values.inspection_due}
                onChange={setFieldValue}
              />
            </div>
            <div className="w-1/2">
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
