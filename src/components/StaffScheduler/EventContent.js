import React from "react";
import moment from 'moment'
import { Container, HeadingContainer, StaffContainer, TaskContainer } from "./styledComponents";

const EventView = ({ event }) => {
  const color = {
    null: "#3B82F6",
    Low: "#10B981",
    Med: "#FBBF24",
    High: "#EF4444",
  };
  const eventProp = event.extendedProps;
  const styles = () => ({
    color: "white",
    backgroundColor: color[eventProp.risk] || "#10B981",
    border: "1px solid #047857",
  });

  // console.log("eventProp", eventProp);
  const {type, leaveType, staff, comments } = eventProp

  if (type === "Leave") {
    const start = moment(event.start).format("DD/MM/YYYY")
    const end = moment(event.end).format("DD/MM/YYYY");
      console.log("EVENT", event);
    return (
      <Container
        padding="0.5px"
        fontSize="0.8rem"
        color={styles().color}
        backgroundColor={styles().backgroundColor}
        border={styles().border}
      >
        <HeadingContainer>
          {staff} - {leaveType}
        </HeadingContainer>
        <StaffContainer>{start} - {end}</StaffContainer>
        {comments && <StaffContainer>{comments}</StaffContainer>}
      </Container>
    );
  }
  return (
    <Container
      padding="0.5px"
      fontSize="0.8rem"
      color={styles().color}
      backgroundColor={styles().backgroundColor}
    >
      <HeadingContainer>{event.title}</HeadingContainer>
      <StaffContainer>
        <b>Job:</b> {eventProp.job}
      </StaffContainer>
      <StaffContainer>
        <b>Team Leader:</b> {eventProp.teamLeader}
      </StaffContainer>
      <StaffContainer>
        <b>Vehicles:</b> {eventProp.vehicles}
      </StaffContainer>
      <TaskContainer>
        <b>Tasks:</b> {eventProp.tasks}
      </TaskContainer>
      <TaskContainer>
        <b>Start Time:</b> {eventProp.timeStart}
      </TaskContainer>
      <TaskContainer>
        <b>Notes:</b> {eventProp.notes}
      </TaskContainer>
    </Container>
  );
};

export default EventView;
