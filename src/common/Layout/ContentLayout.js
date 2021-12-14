import * as React from "react";

export const ContentLayout = ({ children, title }) => (
  <>
    <div className="px-10 py-6 mb-6 pb-5 sm:flex sm:items-center sm:justify-between">
      <h2 className="text-lg leading-6 font-medium text-gray-900">{title}</h2>
    </div>
    <div className="w-full mx-auto px-4 sm:px-6">{children}</div>
  </>
);
