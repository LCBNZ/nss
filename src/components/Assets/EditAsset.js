/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import { SideModal, Input, TextArea, Dropdown, Address, DateSelect } from "../../common";

import { CreateFile } from "./CreateFile";
import { AssetsApi, StaffApi } from "../../api";

import { categoryOptions, statusOptions, typeOptions } from "./options"

export function EditAssetForm({ heading, open, setOpen, formType = "create" }) {
  const [asset, setAsset] = useState([]);

  const updateAssetMutation = AssetsApi.useUpdateAsset();
    const staffData = StaffApi.useStaff();

    const renderStaffList = () => {
      if (staffData?.data && staffData?.data?.length > 0) {
        return staffData.data.map((staff) => ({
          label: staff.staff_name,
          value: staff.id,
        }));
      }
      return [];
    };

  const history = useHistory();
  const { assetId } = useParams();

  useEffect(() => {
    let isCurrent = true;

    if (!open && assetId) {
      history.goBack();
    }

    if (assetId) {
      AssetsApi.fetchAsset(assetId).then((vehicleData) => {
        if (isCurrent) setAsset(vehicleData);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [assetId, open]);
  console.log("ASSET", asset)
  if (assetId && !asset.id) {
    return <div>Loading......</div>;
  }

  return (
    <div>
      <Formik
        initialValues={{
          manufacture_num: asset.manufacture_num || "",
          item_code: asset.item_code || "",
          asset_type: asset.asset_type || "",
          asset_category: asset.asset_category || "",
          make_type: asset.make_type || "",
          assigned_to: asset.assigned_to || "",
          date_assigned: asset.date_assigned || "",
          manufacture_date: asset.manufacture_date || "",
          last_inspected: asset.last_inspected || "",
          next_inspection: asset.next_inspection || "",
          asset_expiry: asset.asset_expiry || "",
          comments: asset.comments || "",
          photo_1: asset.photo_1 || "",
          photo_2: asset.photo_2 || "",
          status: asset.status || "Active",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const assetPayload = {
            manufacture_num: values.manufacture_num || "",
            item_code: values.item_code || "",
            asset_type: values.asset_type || "",
            asset_category: values.asset_category || "",
            make_type: values.make_type || "",
            assigned_to: values.assigned_to || "",
            date_assigned: values.date_assigned
              ? moment(values.date_assigned, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            manufacture_date: values.manufacture_date
              ? moment(values.manufacture_date, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            last_inspected: values.last_inspected
              ? moment(values.last_inspected, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            next_inspection: values.next_inspection
              ? moment(values.next_inspection, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            asset_expiry: values.asset_expiry
              ? moment(values.asset_expiry, "DD/MM/YYYY").format("DD/MM/YYYY")
              : "",
            comments: values.comments || "",
            photo_1: values.photo_1 || "",
            photo_2: values.photo_2 || "",
            status: values.status,
          };

          try {
            await updateAssetMutation.mutateAsync({
              asset: assetPayload,
              assetId,
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
            <div className="flex items-center">
              <Input
                title="Manufacturers #"
                id="manufacture_num"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.manufacture_num}
              />
              <Dropdown
                label="Asset Type"
                id="asset_type"
                value={values.asset_type}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={typeOptions}
              />
            </div>
            <div className="flex items-center">
              <Input
                title="Make / Type"
                id="make_type"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.make_type}
              />
              <div className="w-full px-4">
                <label
                  id="staff"
                  htmlFor="staff"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Staff
                </label>
                <Select
                  name="assigned_to"
                  id="assigned_to"
                  value={renderStaffList().filter((option) =>
                    values?.assigned_to?.includes(option.label),
                  )}
                  options={renderStaffList()}
                  isLoading={staffData.isLoading}
                  onChange={(value) => {
                    console.log("VALUE", value);
                    setFieldValue("assigned_to", value?.label);
                  }}
                  classNamePrefix="select"
                />
              </div>
              {/* <Dropdown
                label="Assigned To"
                id="assigned_to"
                value={values.assigned_to}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                isLoading={staffData.isLoading}
                options={renderStaffList()}
              /> */}
            </div>

            <div className="w-1/2">
              <Dropdown
                label="Asset Category"
                id="asset_category"
                value={values.asset_category}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                options={categoryOptions}
              />
            </div>
            <div className="flex items-center">
              <DateSelect
                title="Date Assigned"
                id="date_assigned"
                value={values.date_assigned}
                onChange={setFieldValue}
              />
              <DateSelect
                title="Manufacture Date"
                id="manufacture_date"
                value={values.manufacture_date}
                onChange={setFieldValue}
              />
            </div>

            <div className="flex items-center">
              <DateSelect
                title="Last Inspection"
                id="last_inspected"
                value={values.last_inspected}
                onChange={setFieldValue}
              />
              <DateSelect
                title="Next Inspection"
                id="next_inspection"
                value={values.next_inspection}
                onChange={setFieldValue}
              />
            </div>
            <div className="w-1/2">
              <DateSelect
                title="Asset Expiry"
                id="asset_expiry"
                value={values.asset_expiry}
                onChange={setFieldValue}
              />
            </div>
            <div>
              <TextArea
                title="Comments"
                id="comments"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.comments}
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
            <div className="flex items-center mx-auto py-4">
              <div className="w-1/2 mx-auto">
                <h4 className="text-center font-semibold font-md">Photo 1</h4>
                <CreateFile field="photo_1" setFieldValue={setFieldValue} />
              </div>
              <div className="w-1/2 mx-auto">
                <h4 className="text-center font-semibold font-md">Photo 2</h4>
                <CreateFile field="photo_2" setFieldValue={setFieldValue} />
              </div>
            </div>
          </SideModal>
        )}
      </Formik>
    </div>
  );
}
