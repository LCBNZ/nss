import styled from "styled-components";

export const Container = styled.main`
  z-index: 0;
  width: 100%;
  height: 100%;
  padding: ${({ padding }) => padding};
  font-size: ${({ fontSize }) => fontSize};
  overflow: hidden;
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: ${({ border }) => border};
  cursor: pointer;
`;
/* border-left: ${({ borderLeft }) => borderLeft}; */

export const TagContainer = styled.div`
  background-color: #f7f7f7;
  padding: 0 0.2rem;
  text-transform: uppercase;
  font-family: "Roboto";
  font-size: 0.7rem;
`;

export const HeadingContainer = styled.h3`
  font-weight: 600;
  line-height: 1.4;
  font-size: 13px;
`;

export const StaffContainer = styled.p`
  margin-top: 4px;
  font-weight: 500;
  line-height: 1.2;
  font-size: 11px;
`;

export const TaskContainer = styled.p`
  margin-top: 2px;
  font-weight: 400;
  line-height: 1.2;
  font-size: 11px;
`;
