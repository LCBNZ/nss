import { CheckIcon } from "@heroicons/react/solid";

export function Approve({ text }) {
  return (
    <button
      type="button"
      className="inline-flex items-center px-4 py-1 ml-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <CheckIcon className="text-green-700 -ml-2 mr-1 h-6 w-6" aria-hidden="true" />
      {text}
    </button>
  );
}
