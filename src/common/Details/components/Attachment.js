import { PaperClipIcon } from "@heroicons/react/solid";

export function Attachment({ attachment }) {
  return (
    <div className="sm:col-span-2">
      <dt className="text-sm font-medium text-gray-500">Attachments</dt>
      <dd className="mt-1 text-sm text-gray-900">
        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
          <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
            <div className="w-0 flex-1 flex items-center">
              <PaperClipIcon
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-2 flex-1 w-0 truncate">{attachment}</span>
            </div>
            <div className="ml-4 flex-shrink-0">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Download
              </a>
            </div>
          </li>
        </ul>
      </dd>
    </div>
  );
}
