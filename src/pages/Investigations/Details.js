import React, { useEffect, useState } from "react";
import moment from 'moment'
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import { InvestigationsApi } from "../../api";

import { TwoColumnDetails, Section } from "../../common/Details";
import { Spinner, Tabs } from "../../common";
import { JobTasks } from "../../components/Jobs/Tasks/JobTaskTable";
import { HandoverForm } from "../../components/Jobs/Handover";
import { FileList } from "../../components/Files";
import { NoteList } from "../../components/Notes";
import { AppFileList } from "../../components/AppFiles";

export const InvestigationDetails = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const { investigationId } = useParams(0);
  const location = useLocation();
  const history = useHistory();

  const { data, isLoading } = InvestigationsApi.useFetchInvestigation(investigationId);

    const items = [
      { label: "Files", id: 0 },
      { label: "Notes", id: 1 },
      { label: "App Files", id: 2 },
    ];

  if (isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const editPage = {
    pathname: `/investigations/${investigationId}/editInvestigation`,
    state: { background: location, name: "editInvestigation" },
  };

  return (
    <div className="w-full mx-auto mt-8 mb-28">
      <TwoColumnDetails
        heading="Investigation Report Details"
        editBtn="Edit Investigation"
        editLink={editPage}
      >
        <Section title="Date" content={moment(data.created_at).format("DD/MM/YYYY")} />
        <Section title="Investigation Id" content={`INV-${data.id}`} />
        <Section title="Type" content={data.type || ""} />
        <Section title="Action Required" content={data.action_required || ""} />
        <Section title="Assigned To" content={data?.staff?.staff_name || ""} />
        <Section title="Date Required" content={data.date_required} />
        <Section title="Notes" content={data.note} />
        <Section title="" content="" />
        <Section title="Date Completed" content={data.date_completed} />
        <Section title="Completed" content={data.completed} />
        <Section
          title="File"
          content={
            <>
              {data.file && (
                <a
                  href={data.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 font-semibold"
                >
                  Link
                </a>
              )}
            </>
          }
        />
        <Section
          title="Follow-up File"
          content={
            <>
              {data.follow_up_file && (
                <a
                  href={data.follow_up_file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 font-semibold"
                >
                  Link
                </a>
              )}
            </>
          }
        />
        <Section title="Created By" content={data.created_by} />
      </TwoColumnDetails>

      <div className="px-8">
        <Tabs tabIndex={tabIndex} setTabIndex={setTabIndex} tabs={items} />
      </div>

      {tabIndex === 0 && (
        <div className="mb-8">
          <FileList
            title="Files"
            column="investigation_id"
            type="investigations"
            id={investigationId}
          />
        </div>
      )}

      {tabIndex === 1 && (
        <div className="mb-8">
          <NoteList
            title="Notes"
            column="investigation_id"
            type="investigations"
            id={investigationId}
          />
        </div>
      )}

      {tabIndex === 2 && (
        <div className="">
          <AppFileList
            title="App Files"
            column="investigation_id"
            fileType="Accident Investigation"
            id={investigationId}
          />
        </div>
      )}
    </div>
  );
};
