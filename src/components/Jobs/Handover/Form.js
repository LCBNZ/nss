/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { PlusCircleIcon, DocumentIcon } from "@heroicons/react/outline";
import moment from "moment";
import { Formik } from "formik";
import { useParams } from "react-router-dom";
import {
  SideModal,
  Input,
  TextArea,
  Dropdown,
  Spinner,
  DateSelect,
  ConfirmationDialog,
  Button,
} from "../../../common";

import { JobsApi } from "../../../api";

import { useNotificationStore } from "../../../store/notifications";
import supabase from "../../../api/supabase";

const yesNoOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const yesNoNaOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "N/A", label: "N/A" },
];

const assignToOptions = [
  { value: "Supervisor", label: "Supervisor" },
  { value: "Leading Hand", label: "Leading Hand" },
];

export function HandoverForm({ jobId, handover }) {
  const [handoverData, setHandoverData] = useState(null);
  const { addNotification } = useNotificationStore();
  const [fileUpload, setFileUpload] = useState({
    file: "",
    status: "",
    url: "",
  });

  useEffect(() => {
    if (handover.length) {
      setHandoverData(handover?.[0]);
    }
  }, []);
  const user = supabase.auth.user();

  const createJobHandoverMutation = JobsApi.useCreateJobHandover();
  const updateJobHandoverMutation = JobsApi.useUpdateJobHandover();

  const handleFileChoosen = async (e) => {
    const file = e.target.files[0];

    const randomNum = Math.floor(Math.random() * 10000) + 1;
    const fileName = `${file.name}-${randomNum}`;
    const uploadFile = await supabase.storage
      .from("job-files")
      .upload(`worksafe/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
    const key = uploadFile?.data?.Key;
    if (key) {
      try {


        const uploadedFile = await supabase.storage
          .from("job-files")
          .getPublicUrl(`worksafe/${fileName}`);

        if (uploadedFile?.publicURL) {
          setFileUpload({
            ...fileUpload,
            file: fileName,
            status: "Success",
            url: uploadedFile?.publicURL,
          });

          addNotification({
            isSuccess: true,
            heading: "Success!",
            content: `Successfully uploaded File`,
          });
        }
      } catch (err) {
        addNotification({
          isSuccess: true,
          heading: "Error!",
          content: `Error uploading file!`,
        });
      }
    }
  };

  if (!user)
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <ConfirmationDialog
      isDone={createJobHandoverMutation.isSuccess || updateJobHandoverMutation.isSuccess}
      size="4xl"
      icon="info"
      title="Job Handover Document"
      body=""
      triggerButton={
        <Button
          size="sm"
          variant="inverse"
          className="mt-4"
          startIcon={<DocumentIcon className="w-4 h-4" />}
        >
          Handover Document
        </Button>
      }
      confirmButton={
        <Button type="submit" form="handoverForm">
          {handover.length ? "Update Document" : "Create Document"}
        </Button>
      }
    >
      <div>
        <Formik
          initialValues={{
            job_id: jobId,
            // Financials
            billing_address: handoverData?.billing_address || "No",
            credit_check: handoverData?.credit_check || "No",
            credit_check_who: handoverData?.credit_check_who || "",
            credit_check_when: handoverData?.credit_check_when
              ? moment(handoverData?.credit_check_when, 'DD/MM/YYYY').format("DD/MM/YYYY")
              : "",
            work_safe: handoverData?.work_safe || "",
            worksafe_uploaded: handoverData?.worksafe_uploaded || user?.user_metadata?.name,
            worksafe_uploaded_when: handoverData?.worksafe_uploaded_when
              ? moment(handoverData?.worksafe_uploaded_when).format("DD/MM/YYYY")
              : moment().format("DD/MM/YYYY"),
            sssp_added: handoverData?.sssp_added || "",
            swms_added: handoverData?.swms_added || "",
            hs_officer: handoverData?.hs_officer || "",
            hs_officer_phone: handoverData?.hs_officer_phone || "",
            hs_officer_email: handoverData?.hs_officer_email || "",
            operation_assignee: handoverData?.operation_assignee || "",
            site_forman: handoverData?.site_forman || "",
            site_forman_email: handoverData?.site_forman_email || "",
            site_forman_phone: handoverData?.site_forman_phone || "",
            gear_shortages: handoverData?.gear_shortages || "",
            allowed_quote: handoverData?.allowed_quote || "",
            engaged_engineer: handoverData?.engaged_engineer || "",
            staff_availability: handoverData?.staff_availability || "",
            booked_shrinkwrappers: handoverData?.booked_shrinkwrappers || "",
          }}
          onSubmit={async (values) => {
            const creditCheck = values.credit_check_when;
            const handoverPayload = {
              job_id: jobId,
              // Financials
              billing_address: values.billing_address,
              credit_check: values.credit_check,
              credit_check_who: values.credit_check_who,
              credit_check_when: creditCheck ? moment(creditCheck).format("DD/MM/YYYY") : "",

              // HEALTH & SAFETY
              work_safe: values?.work_safe || fileUpload.url,
              worksafe_uploaded: fileUpload.url ? values.worksafe_uploaded : "",
              worksafe_uploaded_when: fileUpload.url ? values.worksafe_uploaded_when : "",
              sssp_added: values.sssp_added,
              swms_added: values.swms_added,
              hs_officer: values.hs_officer,
              hs_officer_phone: values.hs_officer_phone,
              hs_officer_email: values.hs_officer_email,

              // OPERATIONS
              operation_assignee: values.operation_assignee,
              site_forman: values.site_forman,
              site_forman_email: values.site_forman_email,
              site_forman_phone: values.site_forman_phone,
              gear_shortages: values.gear_shortages,
              allowed_quote: values.allowed_quote,
              engaged_engineer: values.engaged_engineer,
              staff_availability: values.staff_availability,
              booked_shrinkwrappers: values.booked_shrinkwrappers,
            };

            if (!handoverData) {
              await createJobHandoverMutation.mutateAsync(handoverPayload);
              window.location.reload(false);
            } else {
              await updateJobHandoverMutation.mutateAsync({
                payload: handoverPayload,
                handoverId: handoverData.id,
              });
              window.location.reload(false);
            }

            //
            // } catch(err) {
            //
            // }


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
            <form onSubmit={handleSubmit} className="w-full" id="handoverForm">
              {/** ****************************************
               *
               * FINANCIALS
               *
               **************************************** */}
              <div>
                <h2 className="pl-4 text-md leading-6 uppercase text-gray-700 my-4">FINANCIALS</h2>
                <div className="border-b" />
                <div className="flex items-center">
                  <Dropdown
                    label="Billing Address Added?"
                    id="billing_address"
                    value={values.billing_address}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    options={yesNoOptions}
                  />
                  <Dropdown
                    label="Credit Check Completed?"
                    id="credit_check"
                    value={values.credit_check}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    options={yesNoOptions}
                  />
                </div>
              </div>

              {values.credit_check === "Yes" && (
                <div className="flex items-center">
                  <Input
                    title="By Who?"
                    id="credit_check_who"
                    type="text"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.credit_check_who}
                    // error={errors.site}
                  />
                  <DateSelect
                    title="When?"
                    id="credit_check_when"
                    value={values.credit_check_when}
                    onChange={setFieldValue}
                  />
                </div>
              )}

              {/** ****************************************
               *
               * HEALTH & SAFETY
               *
               **************************************** */}
              <h2 className="pl-4 text-md leading-6 uppercase text-gray-700 my-4">
                Health & Safety
              </h2>
              <div className="border-b" />
              <h2 className="pl-4 text-sm leading-6 uppercase text-gray-700 my-4">
                Work Safe Notification PDF
              </h2>
              {handoverData?.work_safe ? (
                <a
                  target="_blank"
                  href={handoverData?.work_safe}
                  rel="noreferrer"
                  className="px-4 text-blue-500"
                >
                  Uploaded PDF Document
                </a>
              ) : (
                <div className="flex items-center pl-4">
                  <input type="file" onChange={handleFileChoosen} />
                  {fileUpload.url && (
                    <a
                      target="_blank"
                      href={fileUpload.url}
                      rel="noreferrer"
                      className="text-blue-500"
                    >
                      {fileUpload.file || "File"}
                    </a>
                  )}
                </div>
              )}

              {fileUpload.url && (
                <div className="flex items-center border-b">
                  <Input
                    title="Uploaded By"
                    id="worksafe_uploaded"
                    type="text"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.worksafe_uploaded}
                    // error={errors.site}
                  />
                  <DateSelect
                    title="Uploaded Date"
                    id="worksafe_uploaded_when"
                    value={values.worksafe_uploaded_when}
                    onChange={setFieldValue}
                  />
                </div>
              )}

              <div className="flex items-center">
                <Dropdown
                  label="SSSP Added?"
                  id="sssp_added"
                  value={values.sssp_added}
                  onChange={setFieldValue}
                  onBlur={setFieldTouched}
                  options={yesNoNaOptions}
                />
                <Dropdown
                  label="SWMS Added?"
                  id="swms_added"
                  value={values.swms_added}
                  onChange={setFieldValue}
                  onBlur={setFieldTouched}
                  options={yesNoNaOptions}
                />
              </div>
              <div className="w-1/2">
                <Input
                  title="H&S Officer"
                  id="hs_officer"
                  type="text"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.hs_officer}
                  // error={errors.site}
                />
              </div>
              <div className="flex items-center">
                <Input
                  title="H&S Officer Phone #"
                  id="hs_officer_phone"
                  type="text"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.hs_officer_phone}
                  // error={errors.site}
                />
                <Input
                  title="H&S Officer Email"
                  id="hs_officer_email"
                  type="text"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.hs_officer_email}
                  // error={errors.site}
                />
              </div>

              {/** ****************************************
               *
               * OPERATIONS
               *
               **************************************** */}
              <div>
                <h2 className="pl-4 text-md leading-6 uppercase text-gray-700 my-4">Operations</h2>
                <div className="border-b" />
                <div className="flex w-1/2">
                  <Dropdown
                    label="Assign to Supervisor or Leading Hand"
                    id="operation_assignee"
                    value={values.operation_assignee}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    options={assignToOptions}
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    title="Client Site Foreman"
                    id="site_forman"
                    type="text"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.site_forman}
                    // error={errors.site}
                  />
                </div>
                <div className="flex items-center">
                  <Input
                    title="Client Site Foreman Phone"
                    id="site_forman_phone"
                    type="text"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.site_forman_phone}
                    // error={errors.site}
                  />
                  <Input
                    title="Client Site Foreman Email"
                    id="site_forman_email"
                    type="text"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.site_forman_email}
                    // error={errors.site}
                  />
                </div>

                <div className="flex items-center">
                  <Dropdown
                    label="Have you notified management of potential gear shortages to complete this job?"
                    id="gear_shortages"
                    value={values.gear_shortages}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    options={yesNoOptions}
                  />
                  <Dropdown
                    label="Are you familiar with what has been allowed for in the quote?"
                    id="allowed_quote"
                    value={values.allowed_quote}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    options={yesNoOptions}
                  />
                </div>

                <div className="flex items-center">
                  <Dropdown
                    label="Have you engaged with an Engineer if required on the Job?"
                    id="engaged_engineer"
                    value={values.engaged_engineer}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    options={yesNoOptions}
                  />
                  <Dropdown
                    label="Have you confirmed staff availability?"
                    id="staff_availability"
                    value={values.staff_availability}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    options={yesNoOptions}
                  />
                </div>
                <div className="w-1/2">
                  <Dropdown
                    label="Have you booked in shinkwrappers if required?"
                    id="booked_shrinkwrappers"
                    value={values.booked_shrinkwrappers}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    options={yesNoOptions}
                  />
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </ConfirmationDialog>
  );
}
