import { Input, Dropdown, DateSelect } from "../../../common";
import { CreateFile } from "../CreateFile";

export function BuildingPassport({ values, handleChange, handleBlur, setFieldValue }) {
  return (
    <div>
      <h3 className="px-4 pt-2 text-lg font-semibold leading-5">
        Building Construction Site Safe Passport
      </h3>
      <div>
        <div className="flex items-center">
          <Input
            title="Passport Number"
            id="passport_num"
            type="text"
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.passport_num}
          />
          <Input
            title="Type"
            id="passport_type"
            type="text"
            handleChange={handleChange}
            handleBlur={handleBlur}
            value={values.passport_type}
          />
        </div>
        <div className="flex items-center">
          <DateSelect
            title="Issue Date"
            id="passport_issue"
            value={values.passport_issue}
            onChange={setFieldValue}
          />
          <DateSelect
            title="Expiry Date"
            id="passport_expiry"
            value={values.passport_expiry}
            onChange={setFieldValue}
          />
        </div>
        <div className="w-1/2">
          <h4 className="text-md font-normal leading-5 px-4">Photo</h4>
          <CreateFile field="passport_photo" setFieldValue={setFieldValue} type="edit" />
        </div>
      </div>
    </div>
  );
}
