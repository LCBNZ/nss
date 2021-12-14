export function FullWidthSection({ title, content }) {
  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd className="mt-1 text-sm text-gray-900">{content}</dd>
        </div>
      </dl>
    </div>
  );
}
