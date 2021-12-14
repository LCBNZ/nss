import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import { SideModal, Input, Dropdown, Address, Spinner } from "../../common";
import { statusOptions } from "../../utils";
import { fetchClient, useCreateClient, useUpdateClient } from "../../api/Clients";

export function ClientForm({ heading, open, setOpen, formType = "create", setClientId }) {
  const [client, setClient] = useState([]);
  const [payload, setPayload] = useState({});

  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  const history = useHistory();
  const { clientId } = useParams();

  useEffect(() => {
    let isCurrent = true;

    if (!open && clientId) {
      history.goBack();
    }

    if (clientId) {
      fetchClient(clientId).then((clientData) => {
        if (isCurrent) setClient(clientData);
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [clientId, open]);

  if (formType === "edit" && !client.id)
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div>
      <Formik
        initialValues={{
          client_name: client?.client_name || "",
          email: client?.email || "",
          phone: client?.phone || "",
          status: client?.status || "Active",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const { client_name, email, phone, status } = values;
          const clientPayload = {
            client_name,
            email,
            phone,
            status,
          };

          try {
            if (formType === "edit") {
              const result = await updateClientMutation.mutateAsync({
                client: clientPayload,
                clientId: client?.id,
              });
            } else {
              const result = await createClientMutation.mutateAsync(clientPayload);

              setClientId(result?.[0]?.id);
            }

            setOpen(false);
            resetForm();
          } catch (err) {
            console.log("ERROR UPDATING", err);
          }
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        }) => (
          <SideModal
            heading={heading}
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmit}
            isLoading={isSubmitting}
            formType={formType}
          >
            <div className="w-1/2">
              <Input
                title="Company"
                id="client_name"
                type="text"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.client_name}
              />
            </div>
            <div className="flex items-center">
              <Input
                title="Contact #"
                id="phone"
                type="text"
                icon="phone"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.phone}
              />
              <Input
                title="Email"
                id="email"
                type="email"
                icon="email"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.email}
              />
            </div>
            <div className="w-1/2">
              <Dropdown
                label="Status"
                id="status"
                options={statusOptions}
                value={values.status}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
            </div>
          </SideModal>
        )}
      </Formik>
    </div>
  );
}
