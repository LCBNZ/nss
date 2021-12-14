import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useCurrentLocation() {
  const location = useLocation();
  return useEffect(() => location.pathname, [location]);
}
