import { Link } from "react-router-dom";
import Tabs from "./Tabs";

export function TwoColumnDetails({ children, heading, subheading, editBtn, editLink, isEditable = true }) {
  return (
    <div className=" pb-6 px-8 bg-white overflow-hidden sm:rounded-lg">
      <div className="bg-gray-50">
        <div className="md:flex md:items-center md:justify-between mx-6 pb-6">
          <h3 className="text-lg leading-6 font-large text-gray-900 mt-6">{heading}</h3>
          {isEditable && (
            <div className="mt-3 flex">
              <Link
                to={editLink}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editBtn}
              </Link>
            </div>
          )}
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 px-6 pb-6">{children}</dl>
    </div>
  );
}
