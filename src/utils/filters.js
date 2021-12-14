import { categoryDropdowns, typeDropdowns, statusDropdowns } from "../components/Assets";

const jobStatusDropdowns = [
  "Admin",
  "Install In Progress",
  "Install Complete",
 "Variation In Progress",
  "Variation Complete",
  "Dismantle In Progress",
  "Dismantle Complete",
  "Job Complete",
  "Admin Complete",
  "Pending Handover",
];

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, Header },
}) {

  const lookup = {
    asset_type: typeDropdowns,
    asset_category: categoryDropdowns,
    job_status: jobStatusDropdowns,
    status: statusDropdowns,
  };

  const options = lookup[id];


  return (
    <select
      className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option
          key={i}
          value={option}
          className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
        >
          {option}
        </option>
      ))}
    </select>
  );
}
