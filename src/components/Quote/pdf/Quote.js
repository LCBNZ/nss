import React from "react";
import moment from "moment";
import { Document, Page, Image, View, Text, Font, StyleSheet } from "@react-pdf/renderer";

import { Table } from "./Table/Table";

import { Description } from "./Description";
import { Terms } from "./Terms";

import logo from "../../../logo.png";
import { sumGrouping } from "../../../utils";
import { quoteColumns, zoneTotalsColumns, additionalItemsColumns } from "./columns";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 600,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  heading: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: 150,
    alignItems: "left",
    fontFamily: "Open Sans",
    fontWeight: "semibold",
    fontSize: 9,
    color: "#1A8140",
    marginTop: 8,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headingContact: {
    textAlign: "right",
    marginTop: 20,
  },
  headingDisplay: {
    display: "flex",
    flexDirection: "row",
  },
  headingText: {
    fontFamily: "Open Sans",
    fontWeight: "semibold",
    fontSize: 7,
  },
  subText: {
    fontFamily: "Open Sans",
    marginLeft: 4,
    fontSize: 7,
    // fontWeight: "semibold",
  },
  logo: {
    objectFit: "contain",
    width: "20%",
    height: "auto",
    paddingTop: 15,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  footerLogo: {
    objectFit: "contain",
    width: "20%",
    height: "auto",
  },

  footerText: {
    fontSize: 6,
    paddingLeft: 10,
  },
});
const showGrouping = true;

export const Quote = ({ quote, invoice, zoneData, additionalData }) => {
  const groupZones = sumGrouping(zoneData);

  const fields = [[quote.street_1], [quote.street_2], [quote.city]];
  const addressFormat = fields
    .map((part) => part.filter(Boolean).join(" "))
    .filter((str) => str.length)
    .join(", ");

  const staffName = quote?.staff?.staff_name;
  const staffEmail = quote?.staff?.email;
  const staffPhone = quote?.staff?.mobile;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headingContainer}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.headingContact}>
            <View style={styles.headingDisplay}>
              <Text style={styles.headingText}>Date:</Text>
              <Text style={styles.subText}>{moment(quote.created_at).format("DD/MM/YYYY")}</Text>
            </View>
            <View style={styles.headingDisplay}>
              <Text style={styles.headingText}>Estimator:</Text>
              <Text style={styles.subText}>{staffName || ""}</Text>
            </View>
            <View style={styles.headingDisplay}>
              <Text style={styles.headingText}>Email:</Text>
              <Text style={styles.subText}>{staffEmail || ""}</Text>
            </View>
            <View style={styles.headingDisplay}>
              <Text style={styles.headingText}>Contact:</Text>
              <Text style={styles.subText}>{staffPhone || ""}</Text>
            </View>
          </View>
          <View style={styles.headingContact}>
            <View style={styles.headingDisplay}>
              <Text style={styles.headingText}>Client:</Text>
              <Text style={styles.subText}>{quote?.clients?.client_name ?? ""}</Text>
            </View>
            <View style={styles.headingDisplay}>
              <Text style={styles.headingText}>Contact Name:</Text>
              <Text style={styles.subText}>{quote?.client_contacts?.name ?? ""}</Text>
            </View>
            <View style={styles.headingDisplay}>
              <Text style={styles.headingText}>Contact Mobile:</Text>
              <Text style={styles.subText}>{quote?.client_contacts?.phone ?? ""}</Text>
            </View>
            <View style={styles.headingDisplay}>
              <Text style={styles.headingText}>Install Address:</Text>
              <Text style={styles.subText}>{addressFormat ?? ""}</Text>
            </View>
          </View>
        </View>
        <Description description={quote.description} />
        <Text style={styles.heading}>Zones</Text>
        <Table invoice={invoice} columns={quoteColumns} groupable={showGrouping} />
        {/* <Text style={styles.heading}>Zone Totals</Text>
        <Table type="Zones" invoice={groupZones} columns={zoneTotalsColumns} /> */}
        <Text style={styles.heading}>Additional Items</Text>
        <Table type="Additional" invoice={additionalData} columns={additionalItemsColumns} />
        <Terms terms={quote.terms} />

        {/* <View style={styles.footer}>
          <Image style={styles.footerLogo} src={logo} />
          <Text style={styles.footerText}>www.nss.co.nz</Text>
        </View> */}
      </Page>
    </Document>
  );
};
