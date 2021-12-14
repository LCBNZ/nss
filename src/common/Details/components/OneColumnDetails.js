export function OneColumnDetails({ children, heading, subheading }) {
  return (
    <div>
      {/* HEADING SECTION */}
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {heading}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{subheading}</p>
      </div>
      <div className="mt-5 border-t border-gray-200">
        <dl className="sm:divide-y sm:divide-gray-200">{children}</dl>
      </div>
    </div>
  );
}
