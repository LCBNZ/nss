export function Section({ title, content }) {
  return (
    <div className="sm:col-span-1">
      <dt className="text-sm font-medium text-gray-500">{title}</dt>
      <dd className="mt-1 text-sm text-gray-900">{content}</dd>
    </div>
  );
}
