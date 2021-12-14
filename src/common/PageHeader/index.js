import { PlusIcon } from "@heroicons/react/solid";
import { Link, useLocation } from "react-router-dom";

export function PageHeading({
  title,
  createBtn = "",
  editBtn = "",
  isEditable,
  setOpen,
  navigate = "",
}) {
  const { pathname } = useLocation();
  return (
    <div className="px-10 py-6 mb-6 pb-5 sm:flex sm:items-center sm:justify-between">
      <h2 className="text-lg leading-6 font-medium text-gray-900">{title}</h2>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {isEditable ? (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            {editBtn}
          </button>
        ) : (
          <>
            {navigate ? (
              <Link to={`${pathname}/${navigate}`}>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                  {createBtn}
                </button>
              </Link>
            ) : (
              <>
                {createBtn && (
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={() => setOpen(true)}
                  >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    {createBtn}
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
