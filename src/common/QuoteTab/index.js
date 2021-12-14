import { useState } from "react";
import { classNames } from "../../utils";

/**
 *
 * EXAMPLE PAYLOAD
 *
 const tabs = [
  { name: "Details", href: "#", id: 0 },
  { name: "Notes", href: "#", id: 1 },
  { name: "Files", href: "#", id: 2 },
 ];
 */

export function QuoteTab({ handleChange, tabs }) {
  const [active, setActive] = useState(0);

  // const handleTabChange = (tab) => {
  //
  // }
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          defaultValue={tabs.find((tab) => active === tab.id)?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4 h-12" aria-label="tabs">
          {tabs.map((tab, index) => (
            <a
              key={tab.name}
              href={tab.href}
              className={classNames(
                tab.id === active
                  ? "border-indigo-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
              )}
              aria-current={tab.id ? "page" : undefined}
              onClick={() => {
                handleChange(tab.id === 0 ? 'Zones' : 'Rates');
                setActive(tab.id);
              }}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
