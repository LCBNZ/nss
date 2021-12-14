import { ExclamationCircleIcon } from "@heroicons/react/solid";

import { classNames } from "../../../utils";

export function TextArea({
  title,
  type,
  id,
  placeholder,
  labelInline = false,
  handleChange,
  handleBlur,
  value,
  error,
  rows = 3
}) {
  return (
    <div
      className={classNames(
        labelInline
          ? "space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5"
          : "block",
        "w-full px-4 py-4",
      )}
    >
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {title}
        </label>
      </div>
      <div className="sm:col-span-2">
        <textarea
          type="text"
          name={id}
          id={id}
          rows={rows}
          className={classNames(
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              : "focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300",
            "block w-full shadow-sm py-2 text-md rounded-md sm:text-sm",
          )}
          placeholder={placeholder}
          aria-invalid="true"
          aria-describedby="email-error"
          onChange={handleChange}
          onBlur={handleBlur}
          value={value || ""}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
}
