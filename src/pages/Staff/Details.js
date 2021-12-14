import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { StaffApi } from "../../api";

import { FileList } from "../../components/Files";
import { LeaveTable } from "../../components/Staff";
import { TwoColumnDetails, Section } from "../../common/Details";
import { Tabs, Spinner } from "../../common";

export const StaffDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const location = useLocation();
  const { staffId } = useParams(0);

  const { data, isLoading } = StaffApi.useFetchStaff(staffId);

  const items = [
    { label: "Files", id: 0 },
    { label: "Leave", id: 1 },
  ];

  const editPage = {
    pathname: `/staff/${staffId}/editStaff`,
    state: { background: location, name: "editStaff" },
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;
  console.log("DATA >>> ", data)
  return (
    <div className="w-full mx-auto mt-8 mb-28">
      {data && (
        <TwoColumnDetails heading="Staff Details" editBtn="Edit Staff" editLink={editPage}>
          <Section title="Staff Name" content={data.staff_name} />
          <Section title="Role" content={data.role} />
          <Section title="Date of Birth" content={data.dob} />
          <Section title="Start Date" content={data.start_date} />
          <Section title="Address" content={data.adress} />
          <Section title="Contact #" content={data.phone} />
          <Section title="Email" content={data.email} />
          <Section title="Status" content={data.status} />
          <h2 className="py-2 text-lg font-medium leading-5 tracking-wide">Driver Licence</h2>
          <div />
          <Section title="Licence Number" content={data.driver_licence} />
          <Section title="Licence Type" content={data.licence_type} />
          <Section title="Licence Class" content={data.licence_class} />
          <Section title="Endorcement" content={data.endorsement} />
          <Section title="Completion Date" content={data.endorsement_complete_date} />
          <Section title="Expiry Date" content={data.endorsement_expiry} />
          <div>
            <h4 className="text-sm font-medium text-gray-500">Photo Front</h4>
            <img
              className="object-contain w-56"
              alt={data?.photo_front || ""}
              src={data?.photo_front || ""}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Photo Back</h4>
            <img
              className="object-contain w-56"
              alt={data?.photo_back || ""}
              src={data?.photo_back || ""}
            />
          </div>

          <h2 className="py-2 text-lg font-medium leading-5 tracking-wide">
            Health and Safety Induction
          </h2>
          <div />
          <Section title="Induction Date" content={data.induction_date} />
          <Section title="Expiry Date" content={data.expiry_date} />
          <div>
            <h4 className="text-sm font-medium text-gray-500">Photo</h4>
            <img className="object-contain w-56" alt={data?.photo || ""} src={data?.photo || ""} />
          </div>
          <div />
          <h2 className="py-2 text-lg font-medium leading-5 tracking-wide">
            Building Construction Site Safe Passport
          </h2>
          <div />
          <Section title="Passport Number" content={data.passport_num} />
          <Section title="Type" content={data.passport_type} />
          <Section title="Issue Date" content={data.passport_issue} />
          <Section title="Expiry Date" content={data.passport_expiry} />
          <div>
            <h4 className="text-sm font-medium text-gray-500">Passport Photo</h4>
            <img
              className="object-contain w-56"
              alt={data?.passport_photo || ""}
              src={data?.passport_photo || ""}
            />
          </div>
          <div />
          <h2 className="py-2 text-lg font-medium leading-5 tracking-wide">
            First Aid Certificate
          </h2>
          <div />
          <Section title="Issue Date" content={data.first_aid_issue} />
          <Section title="Expiry Date" content={data.first_aid_expiry} />
          <div>
            <h4 className="text-sm font-medium text-gray-500">First Aid Photo</h4>
            <img
              className="object-contain w-56"
              alt={data?.first_aid_photo || ""}
              src={data?.first_aid_photo || ""}
            />
          </div>
          <div />
          <h2 className="py-2 text-lg font-medium leading-5 tracking-wide">
            Scaffolding Certificate of Competence
          </h2>
          <div />
          <Section title="Certificate Number" content={data.cert_num} />
          <Section title="Issue Date" content={data.cert_issue_date} />
          <Section title="Expiry Date" content={data.cert_expiry_date} />
          <div>
            <h4 className="text-sm font-medium text-gray-500">Photo</h4>
            <img
              className="object-contain w-56"
              alt={data?.cert_photo || ""}
              src={data?.cert_photo || ""}
            />
          </div>

          <h2 className="py-2 text-lg font-medium leading-5 tracking-wide">
            Safe Operating Procedure
          </h2>
          <div />
          <Section title="SOP Training" content={data.sop_training} />
          <div />
          <h2 className="py-2 text-lg font-medium leading-5 tracking-wide">Other</h2>
          <div />
          <Section title="Height Training" content={data.height_training} />
          <Section title="Height Training Expiry" content={data.height_training_expiry} />
          <div>
            <h4 className="text-sm font-medium text-gray-500">Photo</h4>
            <img
              className="object-contain w-56"
              alt={data?.other_photo || ""}
              src={data?.other_photo || ""}
            />
          </div>
          <Section title="IRD #" content={data.ird_num} />
          <Section title="Last Drug Test - Date" content={data.last_drug_test} />
          <Section title="Kiwisaver" content={data.kiwisaver} />
          <Section title="Employement Contract" content={data.employement_contract} />
        </TwoColumnDetails>
      )}
      <div className="px-8">
        <Tabs tabIndex={tabIndex} setTabIndex={setTabIndex} tabs={items} />
      </div>
      {tabIndex === 0 && (
        <div>
          <FileList title="Staff Files" column="staff_id" type="staff" id={staffId} />
        </div>
      )}

      {tabIndex === 1 && <LeaveTable staffId={staffId} />}
    </div>
  );
};
