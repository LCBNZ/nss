import Select from "react-select";
import { JobsApi } from "../../api";

export function Tasks({ jobId, setFieldValue, type = "create", values = [] }) {
  const tasksQuery = JobsApi.getTasks(jobId);

  const renderTaskList = () => {
    if (tasksQuery?.data && tasksQuery?.data?.length > 0) {
      return tasksQuery.data.map((task) => ({
        label: `${task.zone_label} - ${task.description}`,
        value: task.id,
      }));
    }
    return [];
  };
  return (
    <div className="flex items-center">
      <div className="w-full px-4 py-4">
        {" "}
        <label id="tasks" htmlFor="tasks" className="block mb-1 text-sm font-medium text-gray-700">
          Tasks
        </label>
        <Select
          isMulti
          name="tasks"
          id="tasks"
          options={renderTaskList()}
          value={renderTaskList().filter((option) => values?.task_ids?.includes(option.value))}
          onChange={(value) => {

            const taskVals = value.map((item) => item.value);
            const taskLabels = value.map((item) => item.label);
            setFieldValue("task_ids", taskVals);
            setFieldValue("task_labels", taskLabels);

          }}
          isLoading={tasksQuery.isLoading}
          className="w-full basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    </div>
  );
}
