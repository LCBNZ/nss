import moment from "moment";

export * as SitesUtil from "./Sites";
export * from "./filters"

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export function formatDate(date) {
  return moment(date, "DD/MM/YYYY").format("DD/MM/YYYY");
}

export const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export const numberFormat = new Intl.NumberFormat("en-NZ", {
  style: "currency",
  currency: "NZD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});


export { sumGrouping } from "./sumGrouping";

export function formatQuoteLines(lines, quoteId) {
  return lines.map((line) => ({
    quote_id: quoteId,
    zone: line.zone,
    zone_label: line.zone_label,
    type: line.type,
    description: line.description,
    length: line.length,
    height: line.height,
    width: line.width,
    total_dimensions: line.total_dimensions,
    transport: line.transport,
    weekly_duration: line.weekly_duration,
    weekly_fee: line.weekly_fee,
    erect_dismantle: line.erect_dismantle,
    hire_fee: line.hire_fee,
    total: line.total,
  }));
}

export function formatZones(zones, quoteId) {
  return zones.map((zone) => ({
    quote: quoteId,
    zone_id: zone.zone_id,
    zone_label: zone.zone_label,
  }));
}

export function formatAddons(addons, quoteId) {
  return addons.map((addon) => ({
    quote: quoteId,
    type: addon?.type,
    description: addon.description,
    duration: addon.duration,
    hire_fee: addon.hire_fee,
    fixed_charge: addon.fixed_charge,
    total: addon.total,
  }));
}

export function formatRates(rates, quoteId) {
  return rates.map((rate) => ({
    quote_id: quoteId,
    service: rate.service,
    erect_fee: rate.erect_fee,
    hire_fee: rate.hire_fee,
  }));
}
