export function Address({
  streetId,
  streetId2,
  cityId,
  postalId,
  streetVal,
  street2Val,
  cityVal,
  postalVal,
  handleChange,
  handleBlur,
}) {
  return (
    <div className="px-4 py-4 mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-6 md:gap-6">
        <div className="col-span-3">
          <label
            htmlFor={streetId}
            className="block text-sm font-medium text-gray-700"
          >
            Street address
          </label>
          <input
            type="text"
            name={streetId}
            id={streetId}
            autoComplete="street-address"
            className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleChange}
            onBlur={handleBlur}
            value={streetVal}
          />
        </div>
        <div className="col-span-3">
          <label
            htmlFor={streetId2}
            className="block text-sm font-medium text-gray-700"
          >
            Street 2
          </label>
          <input
            type="text"
            name={streetId2}
            id={streetId2}
            autoComplete="street-address"
            className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleChange}
            onBlur={handleBlur}
            value={street2Val}
          />
        </div>

        <div className="col-span-6 sm:col-span-6 lg:col-span-4">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            name={cityId}
            id={cityId}
            className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleChange}
            onBlur={handleBlur}
            value={cityVal}
          />
        </div>
        <div className="col-span-6 sm:col-span-2 lg:col-span-2">
          <label
            htmlFor="postal-code"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code
          </label>
          <input
            type="text"
            name={postalId}
            id={postalId}
            autoComplete="postal-code"
            className="block w-full mt-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleChange}
            onBlur={handleBlur}
            value={postalVal}
          />
        </div>
      </div>
    </div>
  );
}
