/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import { SideModal, Input, TextArea, Dropdown, Address, DateSelect } from "../../common";

import { VehiclesApi } from "../../api";

const heavyTruckOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const operationalOptions = [
  { value: "Operational", label: "Operational" },
  { value: "Issue", label: "Issue" },
];

export function EditVehicleForm({ heading, open, setOpen, formType = "create" }) {
  const [vehicle, setVehicle] = useState([]);

  const updateVehicleMutation = VehiclesApi.useUpdateVehicle()

  const history = useHistory();
  const { vehicleId } = useParams();

  useEffect(() => {
    let isCurrent = true;

    if (!open && vehicleId) {
      history.goBack();
    }

    if (vehicleId) {
      VehiclesApi.fetchVehicle(vehicleId).then((vehicleData) => {
        if (isCurrent) setVehicle(vehicleData);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [vehicleId, open]);

    if (vehicleId && !vehicle.id) {
      return <div />;
    }

  return (
    <div>
      <Formik
        initialValues={{
          rego: vehicle.rego || "",
          code: vehicle.code || "",
          make: vehicle.make || "",
          model: vehicle.model || "",
          odometer: vehicle.odometer || "",
          hubo: vehicle.hubo || "",
          ruc: vehicle.ruc || "",
          rego_due: vehicle.rego_due || "",
          wof_due: vehicle.wof_due || "",
          service_due_date: vehicle.service_due_date || "",
          service_due: vehicle.service_due || "",
          number_stanchions: vehicle.number_stanchions || "",
          number_binders: vehicle.number_binders || "",
          number_strops: vehicle.number_strops || "",
          heavy_truck: vehicle.heavy_truck || "",
          vehicle_status: vehicle.vehicle_status || "Operational",
          status: vehicle.status || "Active",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const vehiclePayload = {
            rego: values.rego || "",
            code: values.code || "",
            make: values.make || "",
            model: values.model || "",
            odometer: values.odometer || "",
            hubo: values.hubo || "",
            ruc: values.ruc || "",
            rego_due: values.rego_due
              ? moment(values.rego_due, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            wof_due: values.wof_due
              ? moment(values.wof_due, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            service_due_date: values.service_due_date
              ? moment(values.service_due_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            service_due: values.service_due,
            number_stanchions: values.number_stanchions,
            number_binders: values.number_binders,
            number_strops: values.number_strops,
            heavy_truck: values.heavy_truck,
            vehicle_status: values.vehicle_status,
            status: values.status,
          };

          try {
            await updateVehicleMutation.mutateAsync({
              vehicle: vehiclePayload,
              vehicleId,
            });
          } catch (err) {
            console.log("error", err);
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
            <div className="flex w-1/2">
              <Input
                title="Vehicle Rego"
                id="rego"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.rego}
              />
            </div>

            <div className="flex items-center">
              <Input
                title="Make"
                id="make"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.make}
              />
              <Input
                title="Model"
                id="model"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.model}
              />
            </div>

            <div className="flex w-1/2">
              <Input
                title="Code Name"
                id="code"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.code}
              />
            </div>
            <div className="flex items-center">
              <DateSelect
                title="Rego Due"
                id="rego_due"
                value={values.rego_due}
                onChange={setFieldValue}
              />
              <DateSelect
                title="WOF Date"
                id="wof_due"
                value={values.wof_due}
                onChange={setFieldValue}
              />
            </div>

            <div className="flex items-center">
              <DateSelect
                title="Service Due Date"
                id="service_due_date"
                value={values.service_due_date}
                onChange={setFieldValue}
              />
              <Input
                title="Service Due (Km)"
                id="service_due"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.service_due}
              />
            </div>

            <div className="flex items-center">
              <Input
                title="Odometer"
                id="odometer"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.odometer}
              />
              <Input
                title="Hubometer"
                id="hubo"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.hubo}
              />
            </div>

            <div className="flex items-center">
              <Input
                title="RUC"
                id="ruc"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.ruc}
              />
              <Input
                title="Number of Stanchions"
                id="number_stanchions"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.number_stanchions}
              />
            </div>
            <div className="flex items-center">
              <Input
                title="Number of Binders"
                id="number_binders"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.number_binders}
              />
              <Input
                title="Number of Strops"
                id="number_strops"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.number_strops}
              />
            </div>

            <div className="w-1/2">
              <Dropdown
                label="Heavy Truck"
                id="heavy_truck"
                value={values.heavy_truck}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={heavyTruckOptions}
              />
            </div>
            <div className="flex items-center">
              <Dropdown
                label="Operational Status"
                id="vehicle_status"
                value={values.vehicle_status}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={operationalOptions}
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
