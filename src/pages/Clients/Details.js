import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchClient } from "../../api/Clients";

import { FileList } from "../../components/Files";
import { TwoColumnDetails, Section } from "../../common/Details";

export const ClientDetails = () => {
  const [client, setClient] = useState([]);
  const location = useLocation();
  const { clientId } = useParams(0);

  useEffect(() => {
    fetchClient(clientId).then((data) => setClient(data));
  }, [clientId]);

  const editPage = {
    pathname: `/clients/${clientId}/editClient`,
    state: { background: location, name: "editClient" },
  };

  return (
    <div className="w-full mx-auto mt-8">
      {client && (
        <TwoColumnDetails heading="Client Details" editBtn="Edit Client" editLink={editPage}>
          <Section title="Client" content={client.company} />
          <Section />
          <Section title="Main Contact" content={client.main_contact} />
          <Section title="Main Contact #" content={client.main_contact_phone} />
          <Section title="Main Contact Email" content={client.main_contact_email} />
          <Section title="Status" content={client.status} />
        </TwoColumnDetails>
      )}
      <div>
        <FileList title="Client Files" column="client_id" type="clients" id={clientId} />
      </div>
    </div>
  );
};
