import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import supabase from "../supabase";

import { useNotificationStore } from "../../store/notifications";

export async function updateInvestigation({ investigation, investigationId, alert }) {
  const { data, error } = await supabase
    .from("investigation_reports")
    .update(investigation)
    .match({ id: investigationId });

  if (error) {
    throw new Error(error.message);
  }

  // sends email to user
  if (alert && data.length) {
    console.log("ALERT >>>>> ", data);
    if (data[0]?.assigned_to) {
      console.log("USER ID >>>> ", data[0]?.assigned_to);

      const staffEmail = await getStaffEmail(data[0]?.assigned_to);

      if(staffEmail) {
        const res = sendEmail(
          "An investigation report has been assigned to you.",
          formatEmailBody(data[0]),
          staffEmail,
        );
        console.log("EMAIL RES", res)
      }
    }
  }
  
  console.log("HERE")
  try {
    await updateAppenateInvestigation(data);
  } catch (err) {
    console.log("ERROR >> ", err?.message);
  }

  return data;
}

export const useUpdateInvestigation = () => {
  const { addNotification } = useNotificationStore();
  const queryClient = useQueryClient();

  return useMutation((investigation) => updateInvestigation(investigation), {
    onSuccess: (data) => {
      queryClient.refetchQueries("investigations");

      addNotification({
        isSuccess: true,
        heading: "Success!",
        content: `Successfully updated investigation.`,
      });
    },

    onError: (err) => {
      addNotification({
        isSuccess: false,
        heading: "Failed updating investigation",
        content: err?.message,
      });
    },
    mutationFn: updateInvestigation,
  });
};

async function updateAppenateInvestigation(reports) {
  const reportsPayload = [];

  reports.map((report) =>
    reportsPayload.push([
      report.id,
      `INV-${report.id}`,
      report.type || "",
      report.action_required || "",
      report.completed || "",
      report.date_completed || "",
      report.notes || "",
      report.assigned_to || "",
    ]),
  );

  return axios.post("https://scaff-m8-server.herokuapp.com/api/data-sync", {
    id: "bcf16553-d82f-4594-a4ee-adf9002199b5",
    data: reportsPayload,
  });
}

async function getStaffEmail(id) {
  let email = "";

  try {
    const { data, error } = await supabase
      .from("staff")
      .select("id, staff_name, email")
      .eq("id", Number(id));

    if (!error && data.length) {
      email = data[0]?.email
      console.log("USERS EMAIL", email);
    }
  } catch (err) {
    console.log("ERROR FETCHING STAFF", err.message);
  }
  return email;
}

async function sendEmail(title, body, email) {
  try {
    const result = await axios.post(
      "https://scaff-m8-server.herokuapp.com/api/process-email",
      {
        title,
        body,
        emailTo: email,
      },
    );
    console.log("RESULT >>> ", result);
    const status = result?.status;
  } catch (err) {
    console.log("ERROR >>>> ", err);
  }
}

function formatEmailBody(data) {
  return `${data.created_by} has assigned an investigation report to you.

Type: ${data.type}

Action Required: ${data.action_required}

Date Required: ${data.date_required}

This is an automatically generated email, please do not reply.
`;
}
