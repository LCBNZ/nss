import React, { useEffect, useState } from "react";
import { CursorClickIcon } from "@heroicons/react/solid";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import { AssetsApi } from "../../api";

import { TwoColumnDetails, Section } from "../../common/Details";
import { Spinner } from "../../common";
import { JobTasks } from "../../components/Jobs/Tasks/JobTaskTable";
import { HandoverForm } from "../../components/Jobs/Handover";
import { FileList } from "../../components/Files";

export const AssetDetails = () => {
  const { assetId } = useParams(0);
  const location = useLocation();
  const history = useHistory();

  const assetQuery = AssetsApi.useFetchAsset(assetId);
  if (assetQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!assetQuery.data) return null;

  const editPage = {
    pathname: `/assets/${assetId}/editAsset`,
    state: { background: location, name: "editAsset" },
  };

  return (
    <div className="w-full mx-auto mt-8">
      <TwoColumnDetails heading="Asset Details" editBtn="Edit Asset" editLink={editPage}>
        <Section title="Asset #" content={`#${assetQuery?.data?.id + 1000 || ""}`} />
        <Section title="Asset Type" content={assetQuery?.data?.asset_type || ""} />
        <Section title="Manufacturers #" content={assetQuery?.data?.manufacture_num || ""} />
        <Section title="Date Assigned" content={assetQuery?.data?.date_assigned || ""} />
        <Section title="Make / Type" content={assetQuery?.data?.make_type || ""} />
        <Section title="Manufacture Date" content={assetQuery?.data?.manufacture_date || ""} />
        <Section title="Asset Category" content={assetQuery?.data?.asset_category || ""} />
        <Section title="Last Inspection" content={assetQuery?.data?.last_inspected || ""} />
        <Section title="Assigned To" content={assetQuery?.data?.assigned_to || ""} />
        <Section title="Next Inspection" content={assetQuery?.data?.next_inspection || ""} />
        <Section title="Comments" content={assetQuery?.data?.comments || ""} />
        <Section title="Asset Expiry" content={assetQuery?.data?.asset_expiry || ""} />
        <div>
          <h4 className="font-semibold font-md mb-1">Photo 1</h4>
          <img
            className="object-contain w-56"
            alt={assetQuery?.data?.photo_1 || ""}
            src={assetQuery?.data?.photo_1 || ""}
          />
        </div>
        <div>
          <h4 className="font-semibold font-md mb-1">Photo 2</h4>
          <img
            className="object-contain w-56"
            alt={assetQuery?.data?.photo_2 || ""}
            src={assetQuery?.data?.photo_2 || ""}
          />
        </div>
      </TwoColumnDetails>

      <div className="mb-8">
        <FileList title="Asset Files" column="asset_id" type="assets" id={assetId} />
      </div>
    </div>
  );
};
