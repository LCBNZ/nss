import React from "react";

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
    backgroundColor: color[eventProp.risk],
  });

  return (
    <Container
      padding="0.5px"
      fontSize="0.8rem"
      color={styles().color}
      backgroundColor={styles().backgroundColor}
    >
      <HeadingContainer>{event.title}</HeadingContainer>
      <StaffContainer>
        <b>Team Leader:</b> {eventProp.teamLeader}
      </StaffContainer>
      <StaffContainer>
        <b>Staff:</b> {eventProp.staff}
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
