/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import { SideModal, Input, TextArea, Dropdown, Address, DateSelect } from "../../common";

import supabase from "../../api/supabase";
import { useStaff } from "../../api/Staff";
import { InvestigationsApi } from "../../api";
import { CreateFile } from "./CreateFile";

const typeOptions = [
  { value: "Site Inspection Safety Checklist", label: "Site Inspection Safety Checklist" },
  { value: "Incident", label: "Incident" },
  { value: "Accident / Incident", label: "Accident / Incident" },
  { value: "Scaffold Inspection", label: "Scaffold Inspection" },
  { value: "Accident Investigation", label: "Accident Investigation" },
  {
    value: "Prestart: Equipment & Additional Check",
    label: "Prestart: Equipment & Additional Check",
  },
  { value: "HR Incident: Record of Discussion", label: "HR Incident: Record of Discussion" },
  {
    value: "HR Incident: Disciplinary Procedure or Removal from Site",
    label: "HR Incident: Disciplinary Procedure or Removal from Site",
  },
  { value: "HR Incident: Positive", label: "HR Incident: Positive" },
  { value: "Vehicle Inspections", label: "Vehicle Inspections" },
  { value: "Forklift Inspection", label: "Forklift Inspection" },
  { value: "Harness Inspections", label: "Harness Inspections" },
  { value: "Lanyard Inspections", label: "Lanyard Inspections" },
  { value: "Hoist Inspection", label: "Hoist Inspection" },
  {
    value: "Sling / Strop / Ratchet / Chain Inspection",
    label: "Sling / Strop / Ratchet / Chain Inspection",
  },
  { value: "Office / Yard Inspection", label: "Office / Yard Inspection" },
  { value: "Pre-Start: New Hazard / Tool Box", label: "Pre-Start: New Hazard / Tool Box" },
];

const actionOptions = [
  { value: "Further Action Required", label: "Further Action Required" },
  { value: "Email / Inform Site Foreman", label: "Email / Inform Site Foreman" },
  { value: "Accident Investigation", label: "Accident Investigation" },
  { value: "Rectify Failure", label: "Rectify Failure" },
];

const completedOptions = [
  { value: "No", label: "No" },
  { value: "Yes", label: "Yes" },
];

export function EditInvestigationForm({ heading, open, setOpen, formType = "create" }) {
  const staffData = useStaff();
  const [alertUser, setAlertUser] = useState(false);
  const [fileProps, setFileProps] = useState(null)
  const [investigation, setInvestigation] = useState([]);

  const history = useHistory();
  const { investigationId } = useParams();

  const updateInvestigationMutation = InvestigationsApi.useUpdateInvestigation();

  useEffect(() => {
    let isCurrent = true;

    if (!open && investigationId) {
      history.goBack();
    }

    if (investigationId) {
      InvestigationsApi.fetchInvestigation(investigationId).then((data) => {
        if (isCurrent) {
          setFileProps(getFileProps(data?.follow_up_file));
          console.log("fileProps", fileProps);
          setInvestigation(data);
        }
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [investigationId, open]);

  console.log("investigation", investigation);

  const renderStaffList = () => {
    if (staffData?.data && staffData?.data?.length > 0) {
      return staffData.data.map((staff) => ({
        label: staff.staff_name,
        value: staff.id,
      }));
    }
    return [];
  };

  if (investigationId && !investigation.id) {
    return <div />;
  }
  return (
    <div>
      <Formik
        initialValues={{
          type: investigation.type || "",
          action_required: investigation.action_required || "",
          assigned_to: investigation.assigned_to || "",
          date_required: investigation.date_required || "",
          note: investigation.note || "",
          completed: investigation.completed || "No",
          date_completed: investigation.date_completed || "",
          created_by: investigation.created_by || "",
          follow_up_file: investigation.follow_up_file || "",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const loggedInuser = await supabase.auth.user();
          const name = loggedInuser?.user_metadata?.name;
          setSubmitting(true);

          const investigationPayload = {
            type: values.type,
            action_required: values.action_required,
            assigned_to: values.assigned_to || null,
            date_required: values.date_required
              ? moment(values.date_required).format("DD/MM/YYYY")
              : "",
            note: values.note,
            completed: values.completed,
            date_completed: values.date_completed
              ? moment(values.date_completed).format("DD/MM/YYYY")
              : "",
            follow_up_file: values.folow_up_file,
          };

          try {
            await updateInvestigationMutation.mutateAsync({
              investigation: investigationPayload,
              investigationId,
              alert: alertUser,
            });
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
                label="Action Required"
                id="action_required"
                value={values.action_required}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={actionOptions}
              />
            </div>

            <div className="flex items-center">
              <Dropdown
                label="Assigned To"
                id="assigned_to"
                value={values.assigned_to}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={staffData.isLoading}
                options={renderStaffList()}
              />
              <DateSelect
                title="Date Required"
                id="date_required"
                value={values.date_required}
                onChange={setFieldValue}
              />
            </div>
            {values.assigned_to && (
              <div>
                <div className="w-1/2">
                  <Dropdown
                    label="Alert user via email?"
                    value={alertUser ? "Yes" : "No"}
                    onChange={() => setAlertUser(!alertUser)}
                    onBlur={setFieldTouched}
                    options={completedOptions}
                  />
                </div>
              </div>
            )}

            <TextArea
              title="Notes"
              id="note"
              type="text"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.note}
            />
            <div className="flex items-center">
              <Dropdown
                label="Completed"
                id="completed"
                value={values.completed}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={completedOptions}
              />
              <DateSelect
                title="Date Completed"
                id="date_completed"
                value={values.date_completed}
                onChange={setFieldValue}
              />
            </div>
            <div>
              <h4 className="px-4 py-2 block mb-1 text-sm font-medium text-gray-700">
                Follow up file
              </h4>
              <div className="w-1/2 mb-4">
                <CreateFile
                  field="folow_up_file"
                  setFieldValue={setFieldValue}
                  type="edit"
                  file={fileProps}
                />
              </div>
            </div>
          </SideModal>
        )}
      </Formik>
    </div>
  );
}

function getFileProps(file) {
  const url = file;
  const fileName = file?.split("investigation/")?.[1];
  return {
    url,
    fileName
  }
}
