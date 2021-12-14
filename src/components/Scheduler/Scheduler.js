import React, { useState, useEffect } from "react";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

import { JobsApi, VisitsApi } from "../../api";

// import "./styles.module.css";
import EventView from "./EventContent";
import { StyledWrapper } from "./styles/Scheduler";
import { gridViews } from "./static";
import { Spinner } from "../../common";
import { EditVisit } from "../Visits/EditVisit";

// Main Component
const Scheduler = () => {
  const [visitId, setVisitId] = useState(null);
  const [open, setOpen] = useState(true);

  const jobsQuery = JobsApi.useSchedulerJobs();
  const visitsQuery = VisitsApi.useSchedulerVisits();
  const updateVisitMutation = VisitsApi.useUpdateVisit();

  const type = calendarProp();

  const eventContent = (view) => <EventView event={view.event} />;

  const formatResources = () => {
    if (jobsQuery.data) {
      return jobsQuery.data
        .filter((job) => {
          console.log("JOB >>", job)
          return job.end_date !== ""
        })
        .map((job) => ({
            id: job.id,
            title: `${job.id + 1000} - ${job.site}`,
          }));
    }
    return [];
  };

  const onEventClick = ({ event }) => {
    const { publicId, extendedProps } = event._def;
    setVisitId(publicId);
    setOpen(true);
  };

  const eventDrop = async ({ event }) => {
    const visitId = Number(event?.id);
    const newDate = moment(event?.start).format("DD/MM/YYYY");
    const jobId = Number(event?._def?.resourceIds[0]);

    if (visitId && jobId) {
      try {
        const res = await updateVisitMutation.mutateAsync({
          visitId,
          visit: {
            date: newDate,
            job_id: jobId,
          },
        });
      } catch (err) {
        console.log("ERROR", err);
      }
    }
  };

  const formatEvents = () => {
    if (visitsQuery.data) {
      return visitsQuery.data.map((visit) => ({
        id: visit.id,
        resourceId: visit?.job_id,
        title: visit.visit_status,
        risk: visit.risk,
        teamLeader: visit.staff?.staff_name || "",
        staff: visit?.staff_labels?.join(", "),
        tasks: visit?.task_labels?.join(", "),
        vehicles: visit?.vehicle_labels?.join(", "),
        job: `${visit?.jobs?.id + 1000} - ${visit?.jobs?.site}`,
        notes: visit?.notes,
        timeStart: visit?.start_time,
        start: moment(visit?.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
      }));
    }
    return [];
  };

  if (jobsQuery.isLoading || visitsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!jobsQuery.data) return null;
  const firstDay = moment().startOf("week");

  const headerToolbar = {
    left: "title",
    right: "prev,today,next",
  };

  return (
    <StyledWrapper>
      <FullCalendar
        initialView="Week"
        resourceAreaWidth="10%"
        resourceLabelText="fdfgfgdg"
        resourceAreaHeaderContent="Jobs"
        headerToolbar={{
          ...headerToolbar,
          center: "Day,Week,Month",
        }}
        views={{
          Day: {
            type: "resourceTimelineDay",
            slotDuration: { days: 1 },
            slotLabelFormat: [
              { weekday: "long" }, // lower level of text
            ],
            // buttonLabel: "Day",
            eventContent,
          },
          Week: {
            type: "resourceTimelineWeek",
            firstDay,
            slotDuration: { days: 1 },
            slotLabelInterval: { days: 1 },
            weekends: true,
            slotLabelFormat: [
              { weekday: "short" }, // lower level of text
            ],
            // firstDay: 1,
            eventContent,
          },
          Month: {
            type: "resourceTimelineMonth",
            slotLabelInterval: { days: 1 },
            weekends: true,
            eventContent,
          },
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin]}
        resources={formatResources()}
        height="auto"
        editable
        selectable
        dayMaxEvents
        firstDay={1}
        events={formatEvents()}
        eventClick={onEventClick}
        eventDrop={eventDrop}
        // select={select}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      />
      {visitId && open && <EditVisit id={visitId} open={open} setOpen={setOpen} formType="edit" />}
    </StyledWrapper>
  );
};

export default Scheduler;

function calendarProp() {
  const headerToolbar = {
    left: "title",
    right: "prev,today,next",
  };
  return {
    initialView: "Week",
    resourceAreaWidth: "18%",
    headerToolbar: {
      ...headerToolbar,
      center: "Day,Week,Month",
    },

    views: {
      Day: {
        type: "resourceTimelineDay",
        buttonLabel: "Day",
        slotDuration: { days: 1 },
      },
      Week: {
        type: "resourceTimeline",
        slotDuration: { days: 1 },
        // slotLabelFormat: "D",
        // slotLabelFormat: ["dddd D", "ha"],
        weekends: true,
        duration: { days: 7 },
        firstDay: 1,
      },
      Month: {
        type: "resourceTimelineMonth",
        // slotLabelFormat: "D",
      },
    },
  };
}
