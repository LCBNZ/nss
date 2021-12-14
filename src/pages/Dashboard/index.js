import React from "react";
import logo from "../../logo.png";

export function Dashboard() {
  return (
    <>
      <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img className="mx-auto h-24 w-auto" src={logo} alt="Workflow" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to the North shore scaffolding dashboard.
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
