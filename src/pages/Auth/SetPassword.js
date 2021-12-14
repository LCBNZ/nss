import { useRef, useState } from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/solid";
import supabase from "../../api/supabase";

import { useNotificationStore } from "../../store/notifications";

import logo from "../../logo.png";

export function SetPassword() {
  const history = useHistory();
  const { addNotification } = useNotificationStore();

  const user = supabase.auth.user();

  const session = supabase.auth.session();

  const validate = ({ password, confirmPassword }) => {
    const errors = {};
    if (password !== confirmPassword) {
      errors.password = "Password must match.";
    }

    if (password.length < 5) {
      errors.password = "Password length must be greater than 4";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: async ({ fullName, password, confirmPassword }) => {
      const token = session?.access_token;

      supabase.auth.setAuth(token);
      const { data, error } = await supabase.auth.update({
        password,
        data: { name: fullName },
      });

      if (error) {
        addNotification({
          isSuccess: false,
          heading: "Error!",
          content: `Error configuring account!`,
        });
      } else {
        history.push("/");
        addNotification({
          isSuccess: true,
          heading: "Success!",
          content: `Successfully signed in`,
        });
      }
    },
  });

  if (user && user?.user_metadata?.name)
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <span>Your account has already been configured</span>
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <span>User not found.</span>
      </div>
    );
  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img className="mx-auto h-24 w-auto" src={logo} alt="Workflow" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Configure your account</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="password" className="sr-only">
                  Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="Full name"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  onChange={formik.handleChange}
                  value={formik.values.fullName}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                />
              </div>
            </div>
            {formik.errors.password ? (
              <span className="text-sm text-red-500">{formik.errors.password}</span>
            ) : null}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Configure
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
