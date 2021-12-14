import { DocumentDownloadIcon } from "@heroicons/react/solid";

export function ExportButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center px-2.5 py-1 mt-2 ml-4 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <DocumentDownloadIcon
        className="-ml-0.5 mr-1 h-4 w-4"
        aria-hidden="true"
      />
      Export
    </button>
  );
}
