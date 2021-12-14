import { v4 as uuidv4 } from "uuid";

export function formatQuoteLines(lines, quoteId, type = "") {
  return lines.map((line) => ({
    ...(type === "edit" && { id: line.id || null }),
    quote_id: quoteId,
    zone: line.zone,
    zone_label: line.zoneLabel,
    type: line.type,
    description: line.description,
    length: line.lengthMeasurement,
    height: line.height,
    width: line.width,
    total_dimensions: line.totalDimensions || 0,
    weekly_duration: line.duration || 0,
    transport: line.transport || 0,
    erect_dismantle: line.dismantle,
    weekly_fee: line.hireFee || 0,
    total: String(line.total) || "",
  }));
}

export function formatQuotePortalLines(lines, quoteId) {
  return lines.map((item) => ({
    id: item.id,
    zone: String(item.zone).trim(),
    zoneLabel: item.zone_label,
    type: item.type,
    description: item.description,
    lengthMeasurement: item.length,
    height: item.height,
    width: item.width,
    totalDimensions: item.total_dimensions || 0,
    duration: item.weekly_duration || 0,
    transport: item.transport || 0,
    dismantle: item.erect_dismantle,
    hireFee: item.weekly_fee || 0,
    total: item.total || 0,
  }));
}

export function formatZones(zones, quoteId, type = "") {
  return zones.map((zone) => ({
    ...(type === "edit" && { id: zone.zone_id || null }),
    quote: quoteId,
    zone_id: zone.id,
    zone_label: zone.label,
  }));
}

export function formatAddons(addons, quoteId) {
  return addons.map((addon) => ({
    id: addon.id,
    quote: quoteId,
    type: addon.type,
    description: addon.description,
    duration: Number(addon.duration) || null,
    hire_fee: Number(addon.hireFee) || null,
    fixed_charge: Number(addon.fixedCharge) || null,
    total: Number(addon.totalCost) || null,
  }));
}

export function formatRates(rates, quoteId, type = "create") {
  return rates.map((rate) => ({
    ...(type === "edit" && { id: rate.id || null }),
    quote_id: quoteId,
    service: rate.service,
    erect_fee: rate.erect_fee,
    hire_fee: rate.hire_fee,
  }));
}

export function formatPortalAddons(addons) {
  return addons.map((addon) => ({
    id: addon.id,
    type: addon.type,
    description: addon.description,
    duration: addon.duration,
    hireFee: addon.hire_fee,
    fixedCharge: addon.fixed_charge,
    totalCost: Number(addon.total),
  }));
}

export const tabs = [
  { name: "Zones", href: "#", id: 0 },
  { name: "Rates", href: "#", id: 1 },
];

export const zoneOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
];

export const quoteRates = [
  {
    id: uuidv4(),
    service: "Roof",
    erect: "95.00",
    hire: "12.00",
  },
  {
    id: uuidv4(),
    service: "Propping",
    erect: "22.00",
    hire: "2.00",
  },
  {
    service: "Edge Protection",
    erect: "28.00",
    hire: "0.70",
  },
  {
    service: "Shrinkwrap",
    erect: "10.00",
    hire: "0.00",
  },
  {
    service: "Geda 1200",
    erect: "320.00",
    hire: "5.00",
  },
];

export const quoteTerms = `-Scaffolder Rate ($/hour) for works required during normal hours (Monday - Friday 7am - 5pm) | $60/hour
-Scaffolder Rate ($/hour) for works required outside of normal hours stipulated above. | $90/hour
-Small Truck Delivery for Variation Works. | $150.00
-Hiab Truck Delivery for Variation Works. | $250.00


-Please note that the day works rates above exclude travel time. If more than 8 hours of work is provided, then no travel time is charged for. If less than 8 hours of work is provided, then 30mins of travel each way per scaffolder will be added to the Day Works Hours. In addition, any contract works which are delayed due to other trades or the site area where the scaffold is to be built not offering unrestricted access, then the delay will be charged for on Day Works Hours at the above rates.

-NSS makes use of external Engineers when consulting and receiving sign-off on scaffold designs. The above figure is therefore open to fluctuation if all relevant drawings and strucural detail are not provided when requested. Any additional charges will be substantiated by the Engineers Invoices plus 20% to compensate for the work done by NSS to support and assist the Engineer.

-Breakdown of Charges |70% Erect | 30% Dismantle

-Note that if any scaffolding gear is damaged due to the improper use or negligence of any other trades whilst the scaffold is on site, the Contractor will be charged for the replacement cost of the damaged gear. The quote allows for gear to be manually transported horizontally on site for a maximum of 20m. If the gear is not able to be dropped within 20m of where it is to be erected, additional gear movement costs may be incurred.

-This quote is based on NSS being able to use small hoists for the scaffold installation and dismantle. The hoists will require adequate 3-Phase Power provided for the sole use by NSS at the base of the scaffold on each elevation, as required.

-If a hoist is required on the project, this quote allows for the servicing of the hoist but not for any replacement parts required to repair the hoist if damaged whilst on site.

-The GENERAL TERMS AND CONDITIONS OF TRADE of NSS Ltd form part of this quote and are intended to be read in conjunction with this Quotation. T&C's available at www.nss.co.nz/policies/terms-of-service

-Quotes are Valid for three (3) Months.`;
