/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, ChevronDownIcon } from "@heroicons/react/outline";
import supabase from "../../api/supabase";
import { useNotificationStore } from "../../store/notifications";

import logo from "../../logo.png";
import user from "../../user.png";

import { useComponentVisible } from "../../hooks";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  // { name: "Jobs", href: "/jobs" },
  { name: "Clients", href: "/clients" },
  { name: "Scaffold Register", href: "/scaffold-register" },
  { name: "Quote", href: "/quotes" },
];

export default function Navbar() {
  const [openJobDropdown, setOpenJobDropdown] = useState(true);
  const history = useHistory();
  const { pathname } = useLocation();

  const { addNotification } = useNotificationStore();
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-7xl sm:px-4 lg:px-8 z-40">
            <div className="flex justify-between h-16">
              <div className="flex px-2 lg:px-0">
                <div className="flex items-center flex-shrink-0">
                  <img className="block w-auto h-8 lg:hidden" src={logo} alt="Workflow" />
                  <img className="hidden w-auto h-8 lg:block" src={logo} alt="Workflow" />
                </div>
                <JobsNav pathname={pathname} />
                <StaffNav pathname={pathname} />
                <AssetsDropdown pathname={pathname} />
                <div className="hidden lg:ml-6 lg:flex lg:space-x-4">
                  {navigation.map((item, idx) => (
                    <Link
                      key={`nav${idx}`}
                      to={item.href}
                      className={classNames(
                        item.href === pathname
                          ? "border-indigo-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "inline-flex items-center justify-items-start justify-start px-1 pt-1 text-sm font-medium",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <ReportsDropdown pathname={pathname} />
              </div>
              <div className="flex items-center lg:hidden  z-0">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:ml-4 lg:flex lg:items-center z-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative z-10 flex-shrink-0 ml-4">
                  {(status) => (
                    <>
                      <div>
                        <Menu.Button className="flex text-sm bg-white rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span className="sr-only">Open user menu</span>
                          <img className="w-8 h-8 rounded-full" src={user} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        show={status.open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="button"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "w-full text-left px-4 py-2 text-sm text-gray-700",
                                )}
                                onClick={async () => {
                                  history.push("/login");
                                  supabase.auth.signOut();

                                  addNotification({
                                    isSuccess: true,
                                    heading: "Success!",
                                    content: `Successfully Signed Out.`,
                                  });
                                }}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
              {navigation.map((item, idx) => (
                <Link
                  key={`link${idx}`}
                  to={item.href}
                  className={classNames(
                    item.href === pathname
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img className="w-10 h-10 rounded-full" src={user} alt="" />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function JobsNav({ pathname }) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  return (
    <>
      <button
        type="button"
        // onClick={() => setIsComponentVisible(true)}
        onMouseEnter={() => setIsComponentVisible(true)}
        onMouseLeave={() => setIsComponentVisible(false)}
        className={classNames(
          pathname === "/jobs"
            ? "border-indigo-500 text-gray-900"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
          "inline-flex items-center px-1 pt-1 text-sm font-medium -mr-2 ml-4",
        )}
      >
        Jobs
        <ChevronDownIcon className="ml-1 text-gray-500 h-3 w-3" />
        <div ref={ref} className="hidden lg:ml-4 lg:flex lg:items-center z-50 mt-12 ml-10">
          <Menu as="div" className="relative z-10 flex-shrink-0">
            {(status) => (
              <>
                <Transition
                  show={isComponentVisible}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/jobs"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Jobs
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/visits"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Visits
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/scheduler"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Job Scheduler
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/staff-scheduler"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Staff Scheduler
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </button>
    </>
  );
}

function StaffNav({ pathname }) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  return (
    <>
      <button
        type="button"
        // onClick={() => setIsComponentVisible(true)}
        onMouseEnter={() => setIsComponentVisible(true)}
        onMouseLeave={() => setIsComponentVisible(false)}
        className={classNames(
          pathname === "/staff"
            ? "border-indigo-500 text-gray-900"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
          "inline-flex items-center px-1 pt-1 text-sm font-medium -mr-6",
        )}
      >
        Staff
        <ChevronDownIcon className="ml-1 text-gray-500 h-3 w-3" />
        <div ref={ref} className="hidden lg:ml-4 lg:flex lg:items-center z-50 mt-12 ml-10 w-0">
          <Menu as="div" className="relative z-10 flex-shrink-0">
            {(status) => (
              <>
                <Transition
                  show={isComponentVisible}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/staff"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Staff
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/timesheets"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Timesheets
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/approved-timesheets"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Approved Timesheets
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/leave"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Leave
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/approved-leave"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Approved Leave
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </button>
    </>
  );
}

function AssetsDropdown({ pathname }) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  return (
    <>
      <button
        type="button"
        // onClick={() => setIsComponentVisible(true)}
        onMouseEnter={() => setIsComponentVisible(true)}
        onMouseLeave={() => setIsComponentVisible(false)}
        className={classNames(
          pathname === "/assets"
            ? "border-indigo-500 text-gray-900"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
          "ml-4 -mr-2 inline-flex items-center px-1 pt-1 text-sm font-medium -mr-6",
        )}
      >
        Assets
        <ChevronDownIcon className="ml-1 text-gray-500 h-3 w-3" />
        <div ref={ref} className="hidden lg:ml-4 lg:flex lg:items-center z-50 mt-12 ml-10 w-0">
          <Menu as="div" className="relative z-10 flex-shrink-0">
            {(status) => (
              <>
                <Transition
                  show={isComponentVisible}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/vehicles"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Vehicles
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/assets"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Assets
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </button>
    </>
  );
}

function ReportsDropdown({ pathname }) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  return (
    <>
      <button
        type="button"
        // onClick={() => setIsComponentVisible(true)}
        onMouseEnter={() => setIsComponentVisible(true)}
        onMouseLeave={() => setIsComponentVisible(false)}
        className={classNames(
          pathname === "/reports"
            ? "border-indigo-500 text-gray-900"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
          "ml-4 -mr-2 inline-flex items-center px-1 pt-1 text-sm font-medium -mr-6",
        )}
      >
        Reports
        <ChevronDownIcon className="ml-1 text-gray-500 h-3 w-3" />
        <div ref={ref} className="hidden lg:ml-4 lg:flex lg:items-center z-50 mt-12 ml-10 w-0">
          <Menu as="div" className="relative z-10 flex-shrink-0">
            {(status) => (
              <>
                <Transition
                  show={isComponentVisible}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/files"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Files
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/investigations"
                          onClick={() => setIsComponentVisible(false)}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "text-left block px-4 py-2 text-sm text-gray-700",
                          )}
                        >
                          Investigation Reports
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </button>
    </>
  );
}
