import React, { useState, useEffect } from "react";

import {
  PDFViewer,
  Document,
  Page,
  Image,
  View,
  Text,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

import logo from "../../../logo.png";
import footer from "../../../footer.png";

import { useQuoteStore } from "./store";

import { Spinner } from "../../../common";

import { Table } from "./Table/Table";
import { Description } from "./Description";
import { Terms } from "./Terms";

import { quoteColumns, zoneTotalsColumns, additionalItemsColumns } from "./columns";
import { Heading, ClientInfo } from "./Heading";

export function DownloadPDF({ quote }) {

  // const { isLoading, quote } = useQuoteStore();

  return (
    <div>
      <PDFViewer width="100%" height="1000">
        <Document>
          <Page size="A4" style={styles.page}>
            <Heading quote={quote} />
            <ClientInfo quote={quote} />
            <Description description={quote.description} />
            <Text style={styles.heading}>Zones</Text>

            <Table invoice={quote.quote_lines} columns={quoteColumns} groupable />

            {quote?.quote_addons.length ? (
              <View>
                <Text style={styles.heading}>Additional Items</Text>
                <Table
                  type="Additional"
                  invoice={quote.quote_addons}
                  columns={additionalItemsColumns}
                />
              </View>
            ) : null}

            <Terms terms={quote.terms} />

            <View style={styles.footer}>
              {/* <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                fixed
              /> */}
              <Image style={styles.footerLogo} src={footer} fixed />
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    // paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 50,
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
    right: -20,
  },

  footerLogo: {
    objectFit: "contain",
    width: "70%",
    height: "auto",
    marginLeft: 40,
  },

  footerText: {
    fontSize: 6,
    paddingLeft: 10,
  },
});
