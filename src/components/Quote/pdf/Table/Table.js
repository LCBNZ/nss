import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
// import { Header, Row, Footer } from "./index";
import { Header } from "./Header/Header";
import { Row } from "./Row";
import { ZoneRow } from "./ZoneRow";
import { AdditionalRow } from "./AdditionalRow";
import { Footer } from "./Footer";
import { AdditionalFooterRow } from "./AdditionalFooterRow";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});

export const Table = ({ type = "", invoice, columns, groupable }) => (
  <View style={styles.tableContainer}>
    <Header columns={columns} />
    {type === "Zones" ? (
      <>
        <ZoneRow items={invoice} />
        <Footer items={invoice} />
      </>
    ) : type === "Additional" ? (
      <>
        <AdditionalRow items={invoice} />
        <AdditionalFooterRow items={invoice} />
      </>
    ) : (
      <>
        <Row items={invoice} groupable={groupable} />
        <Footer items={invoice} />
      </>
    )}
    {/* <Footer items={invoice.items} /> */}
  </View>
);
