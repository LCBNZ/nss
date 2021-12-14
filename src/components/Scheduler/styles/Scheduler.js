import styled from "styled-components";

export const StyledWrapper = styled.div`
  .btn {
    min-width: 95px;
    line-height: 0.8rem;
  }

  .fc {
    position: relative;
    z-index: 0;
  }

  .fc-datagrid-cell-main {
    white-space: normal;
  }

  .fc-h-event {
    border: none;
    background-color: transparent;
  }

  .table-bordered td {
    border: 1px solid rgba(0, 0, 0, 0.07);
  }

  .fc-toolbar-title {
    font-weight: 600;
  }

  .fc-timeline-slot-cushion.fc-scrollgrid-sync-inner.fc-sticky {
    text-transform: uppercase;
  }

  .fc .fc-timeline-header-row-chrono .fc-timeline-slot-frame {
    justify-content: center;
  }

  .fc-highlight {
    background: lightblue;
  }

  .fc-event-time,
  .fc-event-title {
    padding: 5px 10px;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 0.8rem;
  }

  .fc-daygrid-day.fc-day-today {
    background-color: honeydew;
  }

  .fc-toolbar-title {
    font-size: 18px;
    color: #374151;
  }
`;
