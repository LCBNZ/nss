import React, { useEffect, useState } from "react";
import { CursorClickIcon } from "@heroicons/react/solid";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import moment from "moment";
import { TagsApi } from "../../api";

import { TwoColumnDetails, Section } from "../../common/Details";
import { Spinner } from "../../common";
import { AppFileList } from "../../components/AppFiles";

export const TagDetails = () => {
  const { tagId } = useParams(0);
  const location = useLocation();
  const history = useHistory();

  const tagQuery = TagsApi.useFetchTag(tagId);
  if (tagQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!tagQuery.data) return null;

  const editPage = {
    pathname: `/scaffold-register/${tagId}/editTag`,
    state: { background: location, name: "editTag" },
  };

  return (
    <div className="w-full mx-auto mt-8">
      <TwoColumnDetails heading="Scaffold Register Details" editBtn="Edit Tag" editLink={editPage}>
        <Section
          title="Job"
          content={`${tagQuery?.data?.jobs?.id + 1000} - ${tagQuery?.data?.jobs?.site}` || ""}
        />
        <Section title="Tag #" content={tagQuery?.data?.tag_no || ""} />
        <Section title="Description" content={tagQuery?.data?.description || ""} />
        <Section title="Last Inspection" content={tagQuery?.data?.last_inspection || ""} />
        <Section title="Inspection Due" content={tagQuery?.data?.inspection_due || ""} />
        <Section title="Status" content={tagQuery?.data?.status || ""} />
        <Section
          title="Handover Doc"
          content={
            tagQuery?.data?.handover_doc ? (
              <a
                className="text-blue-500 font-semibold"
                href={`${tagQuery?.data?.handover_doc}.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                fdsfds
              </a>
            ) : (
              ""
            )
          }
        />
        <Section
          title="Date Created"
          content={moment(tagQuery.data.created_at).format("DD/MM/YYYY") || ""}
        />
        <Section title="Created By" content={tagQuery?.data?.status || ""} />
      </TwoColumnDetails>
      <div className="mb-8">
        <AppFileList title="App Files" column="tag_id" fileType="Scaffold Inspection" id={tagId} />
      </div>
    </div>
  );
};
