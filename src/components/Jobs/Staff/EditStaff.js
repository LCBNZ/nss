import Select from "react-select";
import { StaffApi } from "../../../api";

export function EditStaff({ setFieldValue, type = "create", values = [] }) {
  const staffData = StaffApi.useStaff();

  const renderStaffList = () => {
    if (staffData?.data && staffData?.data?.length > 0) {
      return staffData.data.map((staff) => ({
        label: staff.staff_name,
        value: staff.id,
      }));
    }
    return [];
  };
  return (
    <div className="flex items-center">
      <div className="w-full px-4 py-4">
        {" "}
        <label id="staff" htmlFor="staff" className="block mb-1 text-sm font-medium text-gray-700">
          Staff
        </label>
        <Select
          isMulti
          name="staff"
          id="staff"
          options={renderStaffList()}
          value={renderStaffList().filter((option) => values?.staff_ids?.includes(option.value))}
          onChange={(value) => {
            const staffVals = value.map((item) => item.value);
            const staffLabels = value.map((item) => item.label);
            setFieldValue("staff_ids", staffVals);
            setFieldValue("staff_labels", staffLabels);
          }}
          isLoading={renderStaffList.isLoading}
          className="w-full basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    </div>
  );
}
