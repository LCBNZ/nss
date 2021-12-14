import React from "react";
import Select from "react-select";
import { VehiclesApi } from "../../api";

export function EditVehicle({ setFieldValue, type = "create", values = [] }) {
  const vehicleData = VehiclesApi.useVehicles();

  const renderStaffList = () => {
    if (vehicleData?.data && vehicleData?.data?.length > 0) {
      return vehicleData.data.map((vehicle) => ({
        label: `${vehicle.rego} - ${vehicle.make} ${vehicle.model}`,
        value: vehicle.id,
      }));
    }
    return [];
  };
  const displayStaff = React.useMemo(
    () => renderStaffList().filter((option) => values?.includes(option.value)),
    [values],
  );
  return (
    <div className="w-full pl-4 py-4">
      {" "}
      <label
        id="vehicles"
        htmlFor="vehicles"
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        Vehicles
      </label>
      <Select
        isMulti
        name="vehicles"
        id="vehicles"
        options={renderStaffList()}
        value={displayStaff}
        onChange={(value) => {
          const staffVals = value.map((item) => item.value);
          const staffLabels = value.map((item) => item.label);

          setFieldValue("vehicle_ids", staffVals);
          setFieldValue("vehicle_labels", staffLabels);
        }}
        isLoading={renderStaffList.isLoading}
        className="w-full basic-multi-select"
        classNamePrefix="select"
      />
    </div>
  );
}
