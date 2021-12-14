import {  Input, Dropdown, DateSelect } from "../../../common";
import { CreateFile } from "../CreateFile";

const licenceOptions = [
  { value: "Full", label: "Full" },
  { value: "Restricted", label: "Restricted" },
  { value: "Learner Licence", label: "Learner Licence" },
  { value: "International", label: "International" },
];

const classOptions = [
  { value: "Class 2", label: "Class 2" },
  { value: "Class 4", label: "Class 4" },
  { value: "Class 5", label: "Class 5" },
];

export function DriverLicence({ values, handleChange, handleBlur, setFieldValue, setFieldTouched }) {
  return (
    <div>
      <h3 className="px-4 pt-2 text-lg font-semibold leading-5">Driver Licence</h3>
      <div className="flex items-center">
        <Input
          title="Driver Licence Number"
          id="driver_licence"
          type="text"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.driver_licence}
        />
        <Dropdown
          label="Driver Licence Type"
          id="licence_type"
          options={licenceOptions}
          value={values.licence_type}
          onChange={setFieldValue}
          onBlur={setFieldTouched}
        />
        <Dropdown
          label="Driver Licence Class"
          id="licence_class"
          options={classOptions}
          value={values.licence_class}
          onChange={setFieldValue}
          onBlur={setFieldTouched}
        />
      </div>
      <div className="flex items-center">
        <Input
          title="Endorsement"
          id="endorsement"
          type="text"
          handleChange={handleChange}
          handleBlur={handleBlur}
          value={values.endorsement}
        />
        <DateSelect
          title="Completion Date"
          id="endorsement_complete_date"
          value={values.endorsement_complete_date}
          onChange={setFieldValue}
        />
        <DateSelect
          title="Expiry"
          id="endorsement_expiry"
          value={values.endorsement_expiry}
          onChange={setFieldValue}
        />
      </div>
      <div className="flex items-center">
        <div>
          <h4 className="text-md font-normal leading-5 px-4">Photo - Front</h4>
          <CreateFile field="photo_front" setFieldValue={setFieldValue} type="edit" />
        </div>
        <div>
          <h4 className="text-md font-normal leading-5 px-4">Photo - Back</h4>
          <CreateFile field="photo_back" setFieldValue={setFieldValue} type="edit" />
        </div>
      </div>
    </div>
  );
}
