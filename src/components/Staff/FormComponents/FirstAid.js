import { Input, Dropdown, DateSelect } from "../../../common";
import { CreateFile } from "../CreateFile";

export function FirstAid({ values, handleChange, handleBlur, setFieldValue }) {
  return (
    <div>
      <h3 className="px-4 pt-2 text-lg font-semibold leading-5">First Aid Certificate</h3>
      <div>
        <div className="flex items-center">
          <DateSelect
            title="Issue Date"
            id="first_aid_issue"
            value={values.first_aid_issue}
            onChange={setFieldValue}
          />
          <DateSelect
            title="Expiry Date"
            id="first_aid_expiry"
            value={values.first_aid_expiry}
            onChange={setFieldValue}
          />
        </div>
        <div>
          <h4 className="text-md font-normal leading-5 px-4">Photo</h4>
          <CreateFile field="first_aid_photo" setFieldValue={setFieldValue} type="edit" />
        </div>
      </div>
    </div>
  );
}
