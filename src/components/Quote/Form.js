/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { useParams, useHistory } from "react-router-dom";
import { Formik } from "formik";
import clsx from "clsx";
import supabase from "../../api/supabase";

import { ClientForm } from "../Clients";
import { ContactForm } from "../Contacts";
import { Input, TextArea, Dropdown, Address, QuoteTab, Button, Spinner } from "../../common";

import { QuoteLines } from "./QuoteLines";
import { Rates } from "./Rates/Rates";
import { AdditionalItems } from "./AdditionalItems/AdditionalItems";
import { Totals } from "./QuoteTotals";
import { useClients } from "../../api/Clients";
import { useStaff } from "../../api/Staff";
import { useJobs } from "../../api/Jobs";
import { useFetchQuote } from "../../api/Quotes";
import { fetchAllContacts } from "../../api/ClientContacts";

import { useNotificationStore } from "../../store/notifications";

import {
  formatAddons,
  formatQuoteLines,
  formatQuotePortalLines,
  formatPortalAddons,
  formatZones,
  formatRates,
  tabs,
  zoneOptions,
  quoteRates,
  quoteTerms,
} from "./utils";

import { QuotesApi } from "../../api";

export const quoteTypeOptions = [
  { value: "New", label: "New" },
  { value: "Variation", label: "Variation" },
];

export function QuoteForm({ formType = "create" }) {
  const history = useHistory();
  const [redirectOutput, setRedirectOutput] = useState(false);
  const { addNotification } = useNotificationStore();

  const user = supabase.auth.user();

  const [loggedUser, setLoggedUser] = useState(null);

  // Client Form
  const [clientForm, setClientForm] = useState(false);
  const [clientId, setClientId] = useState(null);

  // Contact Form
  const [contactForm, setContactForm] = useState(false);
  const [contactId, setContactId] = useState(null);

  const [transportRate, setTransportRate] = useState(0);
  const [fetchedQuote, setFetchedQuote] = useState([]);
  const [quoteCreating, setQuoteCreating] = useState(false);

  // Quote Lines
  const [quoteLines, setQuoteLines] = useState([]);
  const [additionalItems, setAdditionalItems] = useState([]);

  const [termValues, setTermValues] = useState({
    standardRate: 60,
    nonStandardRate: 90,
    smallTruck: 150,
    hiabTruck: 250
  });

  // Quote Zones
  const [zoneValues, setZoneValues] = useState([]);
  const [zoneLabels, setZoneLabels] = useState([]);
  const [zones, setZones] = useState(null);

  // Totals
  const [weekTotal, setWeekTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [transportTotal, setTransportTotal] = useState(0);

  // Curent Quote Tab
  const [currentTab, setCurrentTab] = useState("Zones");

  const [quoteNum, setQuoteNum] = useState(null);
  const [client, setClient] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [rates, setRates] = useState([]);
  const clientData = useClients();
  const staffData = useStaff();
  const jobData = useJobs();

  const { quoteId } = useParams();

  useEffect(async () => {
    if (formType === "create") {
      const ratesData = await QuotesApi.fetchRates();
      setRates(ratesData);
    }

    // Generate next quote #
    const quotes = await QuotesApi.getQuoteNum();

    const lastQuoteNum = quotes?.quote_num?.split("-")?.[0];
    const nextNumSeq = lastQuoteNum ? Number(lastQuoteNum) + 1 : 1000;

    setQuoteNum(`${String(nextNumSeq)}-1`);
  }, []);

  useEffect(() => {
    renderClientList();
  }, [clientId]);

  useEffect(async () => {
    if (contactId && clientId) {
      const contactsRes = await fetchAllContacts(clientId);
      let contacts;
      if (contactsRes && contactsRes.length > 0) {
        contacts = contactsRes.map((contact) => ({
          label: contact.name,
          value: contact.id,
        }));
      } else {
        contacts = [];
      }
      setContactList(contacts);
    }
  }, [contactId]);

  useEffect(async () => {
    let isCurrent = true;

    if (quoteId) {
      const quote = await QuotesApi.fetchQuote(quoteId);
      setZones(quote?.quote_zones?.length);

      if (isCurrent) {
        if (clientId) {
          const contactsRes = await fetchAllContacts(quote?.client);
          let contacts;
          if (contactsRes && contactsRes.length > 0) {
            contacts = contactsRes.map((contact) => ({
              label: contact.name,
              value: contact.id,
            }));
          } else {
            contacts = [];
          }

          setContactList(contacts);
        }

        setFetchedQuote(quote);
        setRates(quote.quote_rates);

        const formatQuoteLines = formatQuotePortalLines(quote?.quote_lines);
        const formQuoteAddons = formatPortalAddons(quote?.quote_addons);
        const zoneLineItems = zoneOptions.slice(0, quote?.quote_zones.length);

        const labelsArr = quote?.quote_zones.map((item, index) => ({
          zone_id: item.id,
          id: item.zone_id,
          label: String(item.zone_label).trim(),
        }));

        setZoneLabels(labelsArr);

        setZoneValues(zoneLineItems);
        setQuoteLines(formatQuoteLines);
        setAdditionalItems(formQuoteAddons);
      }
    }

    return () => {
      isCurrent = false;
    };
  }, [quoteId]);

  useEffect(async () => {
    if (client) {
      const contactsRes = await fetchAllContacts(client);
      let contacts;
      if (contactsRes && contactsRes.length > 0) {
        contacts = contactsRes.map((contact) => ({
          label: contact.name,
          value: contact.id,
        }));
      } else {
        contacts = [];
      }

      setContactList(contacts);
    }
  }, [client]);

  useEffect(() => {
    let totalWeek = 0;
    let totalAmount = 0;
    let totalTransort = 0;

    if (quoteLines.length) {
      totalWeek += quoteLines.reduce((acc, curr) => acc + Number(curr.hireFee), 0);
      totalAmount += quoteLines.reduce((acc, curr) => acc + Number(curr.total), 0);
      totalTransort += quoteLines.reduce((acc, curr) => acc + Number(curr.transport), 0);
    }
    if (additionalItems.length) {
      totalWeek += additionalItems.reduce((acc, curr) => acc + Number(curr.hireFee), 0);
      totalAmount += additionalItems.reduce((acc, curr) => acc + Number(curr.totalCost), 0);
    }

    setTotal(totalAmount);
    setWeekTotal(totalWeek);
    setTransportTotal(totalTransort);
  }, [quoteLines, additionalItems]);

  // MUTATIONS
  const updateQuoteMutation = QuotesApi.useUpdateQuote();
  const updateZonesMutation = QuotesApi.useUpdateZones();
  const updateLinesMutation = QuotesApi.useUpdateLines();
  const updateAddonsMutation = QuotesApi.useUpdateAddons();
  const updateRatesMutation = QuotesApi.useUpdateRates();

  const createQuoteMutation = QuotesApi.useCreateQuote();
  const createZonesMutation = QuotesApi.useCreateZones();
  const createLinesMutation = QuotesApi.useCreateLines();
  const createAddonsMutation = QuotesApi.useCreateAddons();
  const createRatesMutation = QuotesApi.useCreateRates();

  const renderClientList = () => {
    if (clientData && clientData?.data?.length > 0) {
      return clientData.data.map((client) => ({
        label: client.client_name,
        value: client.id,
      }));
    }
    return [];
  };

  const renderStaffList = () => {
    if (staffData && staffData?.data?.length > 0) {
      return staffData.data.map((staff) => ({
        label: staff.staff_name,
        value: staff.id,
        email: staff.email,
      }));
    }
    return [];
  };

  const renderJobList = () => {
    if (jobData && jobData?.data?.length > 0) {
      return jobData.data.map((job) => ({
        label: `${job.id + 1000} - ${job.site}`,
        value: job.id,
      }));
    }
    return [];
  };

  const renderContactList = () => {};

  const handleZoneChange = (val) => {
    const zoneVal = Number(val);

    const labelsArr = Array(zoneVal)
      .fill()
      .map((obj, index) => ({
        zone_id: zoneLabels[index]?.zone_id || "",
        id: index + 1,
        label: zoneLabels[index]?.label || "",
      }));
    setZoneLabels(labelsArr);
    setZones(val);

    const zoneLineItems = zoneOptions.slice(0, zoneVal);
    setZoneValues(zoneLineItems);
  };

  const handleZoneLabelChange = (val, index) => {
    setZoneLabels(
      zoneLabels.map((item) => {
        if (index === Number(item.id)) {
          return { ...item, label: val.target.value };
        }
        return item;
      }),
    );
  };

  const loggedInUser = () => {
    const staffArr = staffData.data.find((staff) => staff.email === user?.email);
    return staffArr?.id;
  };

  if (!rates.length || quoteNum === null) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (quoteId && !fetchedQuote.id)
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
    // console.log("fetchedQuote >>> ", fetchedQuote);
  return (
    <div className="mb-10">
      <div className="">
        <Formik
          initialValues={{
            quote_type: "New",
            variation_job_id: fetchedQuote.variation_job_id || "",
            quote_num: formType === "edit" ? `${fetchedQuote.quote_num}` : `${quoteNum}`,
            client: fetchedQuote.client || clientId,
            version: fetchedQuote?.version || 1,
            estimator: fetchedQuote?.estimator || loggedInUser(),
            contact: fetchedQuote.contact_id || contactId,
            maxZones: String(fetchedQuote.max_zones) || "",
            description: fetchedQuote.description || "",
            street: fetchedQuote?.street_1 || "",
            street2: fetchedQuote?.street_2 || "",
            city: fetchedQuote?.city || "",
            postal: fetchedQuote.post_code || "",
            transport_total: fetchedQuote || transportRate,
            terms: fetchedQuote?.terms || quoteTerms,
            status: fetchedQuote?.status || "Pending",
          }}
          // validate={(values) => {
          //   const errors = {};
          //   if (!values.quote_num) {
          //     errors.quote_num = "Quote # is required.";
          //   }
          //   if (!values.client) {
          //     errors.client = "Client is required.";
          //   }
          //   if (!values.estimator) {
          //     errors.estimator = "Estimator is required.";
          //   }
          //   return errors;
          // }}
          onSubmit={async (values, { setSubmitting }) => {
            console.time("CREATING");
            setQuoteCreating(true);
            const {
              quote_type,
              variation_job_id,
              quote_num,
              client,
              version,
              contact,
              estimator,
              maxZones,
              description,
              street,
              street2,
              city,
              postal,
              terms,
              status,
            } = values;

            const quotePayload = {
              quote_type,
              variation_job_id: variation_job_id || null,
              quote_num,
              version,
              client: client || null,
              contact_id: contact || null,
              estimator: estimator || null,
              created_by: user?.user_metadata?.name,
              max_zones: maxZones,
              description,
              street_1: street,
              street_2: street2,
              city,
              post_code: postal,
              terms: String(terms),
              transport_total: Number(transportTotal),
              weekly_total: Number(weekTotal) || null,
              total_amount: Number(total) || null,
              status,
            };
            if (formType === "edit") {
              try {
                console.time("TIMER");
                const quoteResult = await updateQuoteMutation.mutateAsync(
                  {
                    quote: quotePayload,
                    quoteId: fetchedQuote?.id,
                  },
                  {
                    onSuccess: (payload) => {
                      const zones = formatZones(zoneLabels, fetchedQuote?.id, "edit");
                      const lines = formatQuoteLines(quoteLines, fetchedQuote?.id, "edit");
                      const addons = formatAddons(additionalItems, fetchedQuote?.id, "edit");
                      const formatedRates = formatRates(rates, fetchedQuote?.id, "edit");

                      updateZonesMutation.mutate(zones, {
                        onSuccess: (payload) => {},
                        onError: (error) => console.log("error", error),
                      });

                      updateLinesMutation.mutate(lines, {
                        onSuccess: (payload) => {},
                        onError: (error) => console.log("error", error),
                      });

                      updateRatesMutation.mutate(formatedRates, {
                        onError: (error) => console.log("error", error),
                      });

                      updateAddonsMutation.mutate(addons, {
                        onSuccess: (payload) => {
                          setQuoteCreating(false);

                          if (redirectOutput) {
                            history.push(`/quotes/${fetchedQuote?.id}/output`);
                          } else {
                            history.push("/quotes");
                          }

                          addNotification({
                            isSuccess: true,
                            heading: "Success!",
                            content: `Successfully updated quote!`,
                          });
                        },
                        onError: (error) => {
                          setQuoteCreating(false);

                          history.push("/quotes");
                          addNotification({
                            isSuccess: false,
                            heading: "Failure!",
                            content: `Failed to update quote. ${error?.message}`,
                          });
                        },
                      });
                    },
                    onError: (error) => console.log("error", error),
                  },
                );
              } catch (err) {
                console.log("error", err);
              }
            } else {
              createQuoteMutation.mutate(quotePayload, {
                onSuccess: (payload) => {
                  const quoteId = payload?.[0]?.id;

                  // Format payloads
                  const zones = formatZones(zoneLabels, quoteId);
                  const addons = formatAddons(additionalItems, quoteId);
                  const lines = formatQuoteLines(quoteLines, quoteId);
                  const formatedRates = formatRates(rates, quoteId);

                  // CREATE ZONES
                  createZonesMutation.mutate(zones, {
                    onError: (error) => console.log("error", error),
                  });

                  // CREATE ZONES
                  createLinesMutation.mutate(lines, {
                    onError: (error) => console.log("error", error),
                  });

                  createRatesMutation.mutate(formatedRates, {
                    onError: (error) => console.log("error", error),
                  });

                  // CREATE QUOTE ADDONS
                  createAddonsMutation.mutate(addons, {
                    onSuccess: (payload) => {
                      setQuoteCreating(false);

                      history.push(`/quotes/${quoteId}/output`);
                      addNotification({
                        isSuccess: true,
                        heading: "Success!",
                        content: `Successfully created quote!`,
                      });
                    },
                    onError: (err) => {
                      setQuoteCreating(false);

                      // history.push("/quotes");
                      addNotification({
                        isSuccess: false,
                        heading: "Failure!",
                        content: `Failed to create quote. ${err?.message}`,
                      });
                    },
                  });
                },
                onError: (err) => {
                  setQuoteCreating(false);
                },
              });
            }
            console.timeEnd("CREATING");
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
            <div className="w-full">
              <div className="flex">
                <form onSubmit={handleSubmit} id="quoteForm" className="w-4/6">
                  <div className="flex">
                    <div className="w-1/2">
                      <Dropdown
                        label="New / Variation"
                        id="quote_type"
                        value={values.quote_type}
                        onChange={(opt, value) => {
                          setFieldValue("quote_type", value);
                          // setClientId(value);
                          // setClient(value);
                        }}
                        onBlur={setFieldTouched}
                        options={quoteTypeOptions}
                      />
                    </div>
                    <div className="w-1/2">
                      {values.quote_type === "Variation" && (
                        <Dropdown
                          label="Job"
                          id="variation_job_id"
                          value={values.variation_job_id}
                          onChange={async (opt, value) => {
                            setFieldValue("variation_job_id", value);

                            // reset field values
                            setFieldValue("client", "");
                            setFieldValue("contact", "");
                            setFieldValue("street", "");
                            setFieldValue("street2", "");
                            setFieldValue("city", "");
                            setFieldValue("postal", "");
                            // Find matching job and quote
                            const jobMatch = jobData.data.find((job) => job.id === value);

                            if (jobMatch && jobMatch.quote_id) {
                              try {
                                const { data, error } = await supabase
                                  .from("quotes")
                                  .select("*")
                                  .eq("id", Number(jobMatch.quote_id));
                                const quote = data?.[0];
                                if (quote) {
                                  setFieldValue("client", quote?.client);
                                  setClientId(quote?.client);
                                  setClient(quote?.client);
                                  setFieldValue("contact", quote?.contact_id || "");
                                  setFieldValue("street", quote?.street_1 || "");
                                  setFieldValue("street2", quote?.street_2 || "");
                                  setFieldValue("city", quote?.city || "");
                                  setFieldValue("postal", quote?.post_code || "");
                                }
                              } catch (err) {
                                console.log("error", err);
                              }
                            }

                            // setClientId(value);
                            // setClient(value);
                          }}
                          onBlur={setFieldTouched}
                          options={renderJobList()}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2">
                      <Dropdown
                        label="Client"
                        id="client"
                        value={values.client}
                        onChange={(opt, value) => {
                          setFieldValue("client", value);
                          setClientId(value);
                          setClient(value);
                        }}
                        onBlur={setFieldTouched}
                        isLoading={clientData.isFetching}
                        options={renderClientList()}
                        // error={errors.client}
                      />
                      {formType !== "edit" && (
                        <div className="flex items-center pl-4">
                          <PlusCircleIcon className="w-6 h-6 text-indigo-500" />
                          <button
                            type="button"
                            className="pl-1 font-semibold leading-5 text-sm text-gray-600 hover:text-gray-800"
                            onClick={() => setClientForm(true)}
                          >
                            Add New Client
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="w-1/2">
                      <Dropdown
                        label="Max Zones"
                        id="maxZones"
                        value={values.maxZones}
                        onChange={(opt, value) => {
                          setFieldValue("maxZones", value);
                          handleZoneChange(value);
                        }}
                        // onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        options={zoneOptions}
                      />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2">
                      <Input
                        title="Quote #"
                        id="quote_num"
                        type="text"
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        value={values.quote_num}
                        // error={errors.quote_num}
                      />
                    </div>

                    <div className="w-1/2">
                      <Dropdown
                        label="Contact"
                        id="contact"
                        value={values.contact}
                        onChange={(opt, value) => {
                          setContactId(value);
                          setFieldValue("contact", value);
                        }}
                        onBlur={setFieldTouched}
                        options={contactList}
                      />
                      {formType !== "edit" && (
                        <div className="flex items-center pl-4">
                          <PlusCircleIcon
                            className={clsx(
                              !clientId ? "text-indigo-100" : "text-indigo-500",
                              "w-6 h-6",
                            )}
                          />
                          <button
                            type="button"
                            className={clsx(
                              !clientId
                                ? "text-gray-200 cursor-none"
                                : "text-gray-600 hover:text-gray-800",
                              "pl-1 font-semibold leading-5 text-sm",
                            )}
                            onClick={() => setContactForm(true)}
                            disabled={!clientId}
                          >
                            Add New Contact
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <TextArea
                    title="Description"
                    id="description"
                    type="text"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.description}
                  />
                  <div className="w-1/2">
                    <Dropdown
                      label="Estimator"
                      id="estimator"
                      // filterByEmail={values.estimator === user?.email}
                      value={values.estimator}
                      onChange={(opt, value) => {
                        setFieldValue("estimator", value);
                      }}
                      onBlur={setFieldTouched}
                      isLoading={staffData.isFetching}
                      options={renderStaffList()}
                      // error={errors.estimator}
                    />
                  </div>
                  <h3 className="text-lg px-4 leading-6 font-large">Site Address</h3>
                  <Address
                    streetId="street"
                    streetId2="street2"
                    cityId="city"
                    postalId="postal"
                    streetVal={values.street}
                    street2Val={values.street2}
                    cityVal={values.city}
                    postalVal={values.postal}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                </form>
                <div className="w-full">
                  <div className="w-4/6 mx-auto">
                    <div className="flex justify-start mb-4">
                      <QuoteTab tabs={tabs} handleChange={(tab) => setCurrentTab(tab)} />
                    </div>
                    {currentTab === "Zones" ? (
                      <>
                        {zones ? (
                          <div className="grid grid-cols-2">
                            {[...Array(Number(zones))].map((_, index) => (
                              <div className="flex items-center" key={index}>
                                <Input
                                  id={index + 1}
                                  title={`Zone ${index + 1}`}
                                  labelInline
                                  placeholder={`Zone ${index + 1}`}
                                  defaultValue={
                                    formType === "edit"
                                      ? fetchedQuote?.quote_zones?.[index]?.zone_label
                                      : ""
                                  }
                                  handleChange={(val) => handleZoneLabelChange(val, index + 1)}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <p>Select # of zones to continue</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <Rates
                        data={rates}
                        setRates={setRates}
                        user={user}
                        handleChange={(data) => {
                          const updatedTerms = formatRateText(data);
                          console.log("CHANGeD!!!! ", updatedTerms);
                          setFieldValue("terms", updatedTerms);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4">
                <QuoteLines
                  quoteLines={quoteLines}
                  setQuoteLines={setQuoteLines}
                  zoneOptions={zoneValues}
                  zoneLabels={zoneLabels}
                  rates={rates}
                  formType={formType}
                />
                <AdditionalItems
                  items={additionalItems}
                  setItems={setAdditionalItems}
                  rates={rates}
                  formType={formType}
                />
              </div>

              <div className="w-3/6">
                <TextArea
                  title="Terms & Conditions"
                  id="terms"
                  type="text"
                  handleChange={handleChange}
                  value={values.terms}
                  rows={10}
                />
              </div>
              <Totals weekTotal={weekTotal} total={total} transportTotal={transportTotal} />
            </div>
          )}
        </Formik>
      </div>
      <div className="pl-4 mt-6">
        {formType === "edit" ? (
          <div className="flex space-x-4">
            <Button
              type="submit"
              form="quoteForm"
              isLoading={quoteCreating && !redirectOutput}
              size="sm"
            >
              Save & Exit
            </Button>
            <Button
              type="submit"
              form="quoteForm"
              isLoading={quoteCreating && redirectOutput}
              size="sm"
              onClick={() => setRedirectOutput(true)}
            >
              Save & View
            </Button>
          </div>
        ) : (
          <Button type="submit" form="quoteForm" isLoading={quoteCreating} size="sm">
            Create Quote
          </Button>
        )}
      </div>
      <ClientForm
        heading="Create Client"
        open={clientForm}
        setOpen={setClientForm}
        setClientId={setClientId}
      />
      <ContactForm
        heading="Create Contact"
        open={contactForm}
        setOpen={setContactForm}
        setContactId={setContactId}
      />
    </div>
  );
}

function formatRateText(rates) {
  console.log("RATES >>> ", rates);
  const standardHireRate = rates[8].erect_fee;
  const nonStandardHireRate = rates[9].erect_fee;
  const smallTruckFee = rates[10].erect_fee;
  const hiabTruckFee = rates[11].erect_fee;
  return `-Scaffolder Rate ($/hour) for works required during normal hours (Monday - Friday 7am - 5pm) | $${standardHireRate}/hour
-Scaffolder Rate ($/hour) for works required outside of normal hours stipulated above. | $${nonStandardHireRate}/hour
-Small Truck Delivery for Variation Works. | $${smallTruckFee}.00
-Hiab Truck Delivery for Variation Works. | $${hiabTruckFee}.00


-Please note that the day works rates above exclude travel time. If more than 8 hours of work is provided, then no travel time is charged for. If less than 8 hours of work is provided, then 30mins of travel each way per scaffolder will be added to the Day Works Hours. In addition, any contract works which are delayed due to other trades or the site area where the scaffold is to be built not offering unrestricted access, then the delay will be charged for on Day Works Hours at the above rates.

-NSS makes use of external Engineers when consulting and receiving sign-off on scaffold designs. The above figure is therefore open to fluctuation if all relevant drawings and strucural detail are not provided when requested. Any additional charges will be substantiated by the Engineers Invoices plus 20% to compensate for the work done by NSS to support and assist the Engineer.

-Breakdown of Charges |70% Erect | 30% Dismantle

-Note that if any scaffolding gear is damaged due to the improper use or negligence of any other trades whilst the scaffold is on site, the Contractor will be charged for the replacement cost of the damaged gear. The quote allows for gear to be manually transported horizontally on site for a maximum of 20m. If the gear is not able to be dropped within 20m of where it is to be erected, additional gear movement costs may be incurred.

-This quote is based on NSS being able to use small hoists for the scaffold installation and dismantle. The hoists will require adequate 3-Phase Power provided for the sole use by NSS at the base of the scaffold on each elevation, as required.

-If a hoist is required on the project, this quote allows for the servicing of the hoist but not for any replacement parts required to repair the hoist if damaged whilst on site.

-The GENERAL TERMS AND CONDITIONS OF TRADE of NSS Ltd form part of this quote and are intended to be read in conjunction with this Quotation. T&C's available at www.nss.co.nz/policies/terms-of-service

-Quotes are Valid for three (3) Months.`;
}
