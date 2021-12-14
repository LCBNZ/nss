import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import "tailwindcss/tailwind.css";

import * as pages from "./pages";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./containers/ProtectedRoute";
import { Auth } from "./contexts";
import supabase from "./api/supabase";

import ScrollToTop from "./utils/ScrollToTop";

function App(props) {
  const location = useLocation();
  const background = location?.state && location?.state?.background;
  const name = location?.state && location?.state?.name;

  const user = supabase.auth.user();
  const renderEditModals = () => {

    switch (name) {
      case "editClient":
        return (
          <Route
            path="/clients/:clientId/editClient"
            children={<pages.ClientPage.EditClient type="edit" />}
          />
        );
      case "editJob":
        return (
          <Route path="/jobs/:jobId/editJob" children={<pages.JobPage.EditJob type="edit" />} />
        );
      case "editVisit":
        return (
          <Route
            path="/visits/:visitId/editVisit"
            children={<pages.VisitPage.EditVisitForm type="edit" />}
          />
        );
      case "editStaff":
        return (
          <Route
            path="/staff/:staffId/editStaff"
            children={<pages.StaffPage.EditStaff type="edit" />}
          />
        );
      case "editTimesheet":
        return (
          <Route
            path="/timesheets/:timesheetId/editTimesheet"
            children={<pages.TimesheetPage.Edit type="edit" />}
          />
        );
      case "editLeave":
        return (
          <Route
            path="/leave/:leaveId/editLeave"
            children={<pages.LeavePage.EditLeave type="edit" />}
          />
        );
      case "editVehicle":
        return (
          <Route
            path="/vehicles/:vehicleId/editVehicle"
            children={<pages.VehiclePage.EditVehicle type="edit" />}
          />
        );
      case "editAsset":
        return (
          <Route
            path="/assets/:assetId/editAsset"
            children={<pages.AssetPage.EditAsset type="edit" />}
          />
        );
      case "editTag":
        return (
          <Route
            path="/scaffold-register/:tagId/editTag"
            children={<pages.ScaffoldRegisterPage.EditTag type="edit" />}
          />
        );
      case "editInvestigation":
        return (
          <Route
            path="/investigations/:investigationId/editInvestigation"
            children={<pages.InvestigationPage.EditInvestigation type="edit" />}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <Auth.Provider>
      {user && <Navbar />}
      <ScrollToTop />
      <Switch location={background || location}>
        <ProtectedRoute exact path="/" component={pages.DashboardPage.Dashboard} />
        <Route exact path="/login" component={pages.AuthPage.Login} />
        <Route exact path="/set-password" component={pages.AuthPage.SetPassword} />
        {/* Vehicles */}
        <ProtectedRoute exact path="/vehicles" component={pages.VehiclePage.VehiclesMain} />
        <ProtectedRoute
          exact
          path="/vehicles/:vehicleId/details"
          component={pages.VehiclePage.VehicleDetails}
        />

        {/* Assets */}
        <ProtectedRoute exact path="/assets" component={pages.AssetPage.AssetsMain} />
        <ProtectedRoute
          exact
          path="/assets/:assetId/details"
          component={pages.AssetPage.AssetDetails}
        />

        {/* Jobs */}
        <ProtectedRoute exact path="/jobs" component={pages.JobPage.JobsMain} />
        <ProtectedRoute exact path="/jobs/:jobId/details" component={pages.JobPage.JobDetails} />
        {/* Visits */}
        <ProtectedRoute exact path="/visits" component={pages.VisitPage.VisitsMain} />
        {/* Clients */}
        <ProtectedRoute exact path="/clients" component={pages.ClientPage.ClientsMain} />
        <ProtectedRoute
          exact
          path="/clients/:clientId/details"
          component={pages.ClientPage.ClientDetails}
        />
        {/* Staff */}
        <ProtectedRoute exact path="/staff" component={pages.StaffPage.StaffMain} />
        <ProtectedRoute exact path="/timesheets" component={pages.TimesheetPage.TimesheetMain} />
        <ProtectedRoute
          exact
          path="/approved-timesheets"
          component={pages.ApprovedTimesheetPage.ApprovedTimesheetMain}
        />
        <ProtectedRoute
          exact
          path="/staff/:staffId/details"
          component={pages.StaffPage.StaffDetails}
        />

        {/* Leave */}
        <ProtectedRoute exact path="/leave" component={pages.LeavePage.LeaveMain} />
        <ProtectedRoute
          exact
          path="/approved-leave"
          component={pages.LeaveApprovedPage.LeaveApprovedMain}
        />

        {/* Scaffold Register */}
        <ProtectedRoute
          exact
          path="/scaffold-register"
          component={pages.ScaffoldRegisterPage.TagsMain}
        />
        <ProtectedRoute
          exact
          path="/scaffold-register/:tagId/details"
          component={pages.ScaffoldRegisterPage.TagDetails}
        />
        {/* Quote */}
        <ProtectedRoute exact path="/quotes" component={pages.QuotePage.QuotesMain} />
        <ProtectedRoute exact path="/quotes/add-quote" component={pages.QuotePage.AddQuote} />
        <ProtectedRoute exact path="/quotes/:quoteId/edit" component={pages.QuotePage.EditQuote} />
        <ProtectedRoute
          exact
          path="/quotes/:quoteId/details"
          component={pages.QuotePage.QuoteDetails}
        />
        <ProtectedRoute exact path="/quotes/:quoteId/output" component={pages.QuotePage.QuotePdf} />
        <ProtectedRoute exact path="/scheduler" component={pages.SchedulerPage.SchedulerMain} />
        <ProtectedRoute
          exact
          path="/staff-scheduler"
          component={pages.StaffSchedulerPage.StaffSchedulerMain}
        />

        {/* Investigations */}
        <ProtectedRoute
          exact
          path="/investigations"
          component={pages.InvestigationPage.InvestigationMain}
        />
        <ProtectedRoute
          exact
          path="/investigations/:investigationId/details"
          component={pages.InvestigationPage.InvestigationDetails}
        />

        {/* Files */}
        <ProtectedRoute
          exact
          path="/files"
          component={pages.FilesPage.FilesMain}
        />
      </Switch>
      {background && name ? renderEditModals() : null}
    </Auth.Provider>
  );
}

export default App;
