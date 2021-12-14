import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { Formik } from "formik";
import { SideModal, Input, Dropdown, Address, Spinner, DateSelect } from "../../common";

import { useCreateStaff, fetchStaff, useUpdateStaff } from "../../api/Staff";
import {
  BuildingPassport,
  DriverLicence,
  HealthSafety,
  Other,
  SafeProcedure,
  ScaffoldingCert,
  FirstAid
} from "./FormComponents";

import { statusOptions } from "../../utils";

const typeOptions = [
  { value: "Employee", label: "Employee" },
  { value: "Foreman", label: "Foreman" },
  { value: "Office", label: "Office" },
  { value: "Scaffolder", label: "Scaffolder" },
  { value: "Truck Driver", label: "Truck Driver" },
  { value: "Application", label: "Application" },
];

export function StaffForm({ heading, open, setOpen, formType = "create" }) {
  const [staff, setStaff] = useState([]);

  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();

  const history = useHistory();
  const { staffId } = useParams();

  useEffect(() => {
    let isCurrent = true;

    if (!open && staffId) {
      history.goBack();
    }
    if (staffId) {
      fetchStaff(staffId).then((data) => {
        if (isCurrent) setStaff(data);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [staffId, open]);

  if (formType === "edit" && !staff.id)
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div>
      <Formik
        initialValues={{
          // Main Staff Details
          staff_name: staff?.staff_name || "",
          type: staff?.type || "",
          mobile: staff?.mobile || "",
          email: staff?.email || "",
          position: staff?.position || "",
          street: staff?.street || "",
          street2: staff?.street_2 || "",
          city: staff?.city || "",
          postal: staff?.post_code || "",
          pin: staff?.pin || "",
          start_date: staff?.start_date || "",
          dob: staff?.dob || "",

          // Drivers Licence Section
          driver_licence: staff?.driver_licence || "",
          licence_type: staff?.licence_type || "",
          licence_class: staff?.licence_class || "",
          endorsement: staff?.endorsement || "",
          endorsement_complete_date: staff?.endorsement_complete_date || "",
          endorsement_expiry: staff?.endorsement_expiry || "",
          photo_front: staff?.photo_front || "",
          photo_back: staff?.photo_back || "",

          // Health & Safety Section
          induction_date: staff?.induction_date || "",
          expiry_date: staff?.expiry_date || "",
          photo: staff?.photo || "",

          // Building construction section
          passport_num: staff?.passport_num || "",
          passport_type: staff?.passport_type || "",
          passport_issue: staff?.passport_issue || "",
          passport_expiry: staff?.passport_expiry || "",
          passport_photo: staff?.passport_photo || "",

          // First aid section
          first_aid_issue: staff?.first_aid_issue || "",
          first_aid_expiry: staff?.first_aid_expiry || "",
          first_aid_photo: staff?.first_aid_photo || "",

          // Safe Cert section
          cert_num: staff?.cert_num || "",
          cert_issue_date: staff?.cert_issue_date || "",
          cert_expiry_date: staff?.cert_expiry_date || "",
          cert_photo: staff?.cert_photo || "",

          // Safe Op section
          sop_training: staff?.sop_training || "",

          // Other section
          height_training: staff?.height_training || "",
          height_training_expiry: staff?.height_training_expiry || "",
          other_photo: staff?.other_photo || "",
          ird_num: staff?.ird_num || "",
          last_drug_test: staff?.last_drug_test || "",
          kiwisaver: staff?.kiwisaver || "",
          employement_contract: staff?.employement_contract || "",

          status: staff?.status || "Active",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          const staffPayload = {
            staff_name: values.staff_name,
            type: values.type,
            mobile: values.mobile,
            email: values.email,
            position: values.position,
            street: values.street,
            street_2: values.street_2,
            city: values.city,
            post_code: values.post_code,
            pin: values.pin,
            status: values.status,
            start_date: values.start_date
              ? moment(values.start_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            dob: values.dob ? moment(values.dob, "DD/MM/YYYY").format("DD/MM/YYYY") : "",

            // Drivers Licence Section
            driver_licence: values.driver_licence,
            licence_type: values.licence_type,
            licence_class: values.licence_class,
            endorsement: values.endorsement,
            endorsement_complete_date: values.endorsement_complete_date
              ? moment(values.endorsement_complete_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            endorsement_expiry: values.endorsement_expiry
              ? moment(values.endorsement_expiry, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            photo_front: values.photo_front,
            photo_back: values.photo_back,

            // Health & Safety Section
            induction_date: values.induction_date
              ? moment(values.induction_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            expiry_date: values.expiry_date
              ? moment(values.expiry_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            photo: values.photo,

            // Building construction section
            passport_num: values.passport_num,
            passport_type: values.passport_type,
            passport_issue: values.passport_issue
              ? moment(values.passport_issue, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            passport_expiry: values.passport_expiry
              ? moment(values.passport_expiry, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            passport_photo: values.passport_photo,

            // First aid section
            first_aid_issue: values.first_aid_issue
              ? moment(values.first_aid_issue, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            first_aid_expiry: values.first_aid_expiry
              ? moment(values.first_aid_expiry, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            first_aid_photo: values.first_aid_photo,

            // Safe Cert section
            cert_num: values.cert_num,
            cert_issue_date: values.cert_issue_date
              ? moment(values.cert_issue_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            cert_expiry_date: values.cert_expiry_date
              ? moment(values.cert_expiry_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            cert_photo: values.cert_photo,

            // Safe Op section
            sop_training: values.sop_training,

            // Other section
            height_training: values.height_training,
            height_training_expiry: values.height_training_expiry
              ? moment(values.height_training_expiry, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            other_photo: values.other_photo,
            ird_num: values.ird_num,
            last_drug_test: values.last_drug_test
              ? moment(values.last_drug_test, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            kiwisaver: values.kiwisaver,
            employement_contract: values.employement_contract,
          };

          try {
            if (formType === "edit") {
              const result = await updateStaffMutation.mutateAsync({
                staff: staffPayload,
                staffId: staff?.id,
              });
            } else {
              const result = await createStaffMutation.mutateAsync(staffPayload);
            }

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
            <div className="flex items-center">
              <Input
                title="Staff Name"
                id="staff_name"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.staff_name}
              />
              <Dropdown
                label="Type"
                id="type"
                options={typeOptions}
                value={values.type}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
            </div>
            <div className="flex items-center">
              <Input
                title="Contact #"
                id="mobile"
                type="text"
                icon="phone"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.mobile}
              />
              <Input
                title="Contact Email"
                id="email"
                type="email"
                icon="email"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.email}
              />
            </div>
            <div className="flex items-center">
              <Input
                title="Position"
                id="position"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.position}
              />
              <Input
                title="PIN"
                id="pin"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.pin}
              />
            </div>
            <Address
              streetId="street"
              streetId2="street2"
              cityId="city"
              postalId="postal"
              streetVal={values.street}
              street2Val={values.street2}
              cityVal={values.city}
              postalVal={values.postal}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <div className="flex items-center">
              <DateSelect
                title="Start Date"
                id="start_date"
                value={values.start_date}
                onChange={setFieldValue}
              />
              <DateSelect
                title="Date of Birth"
                id="dob"
                value={values.dob}
                onChange={setFieldValue}
              />
            </div>
            <DriverLicence
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
            <HealthSafety
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
            <BuildingPassport
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
            />
            <FirstAid
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
            />
            <ScaffoldingCert
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
            <SafeProcedure
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
            <Other
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />
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
