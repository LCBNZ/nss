import React from "react";
import moment from "moment";
import { Text, Image, View, Font, StyleSheet } from "@react-pdf/renderer";

import logo from "../../../../logo.png";

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

export const Heading = ({ quote }) => {
  const fields = [[quote.street_1], [quote.street_2], [quote.city]];
  const addressFormat = fields
    .map((part) => part.filter(Boolean).join(" "))
    .filter((str) => str.length)
    .join(", ");

  const staffName = quote?.staff?.staff_name;
  const staffEmail = quote?.staff?.email;
  const staffPhone = quote?.staff?.mobile;

  const client = quote?.clients?.client_name;
  const contact = quote?.client_contacts?.name;
  const contactPhone = quote?.client_contacts?.phone;
  const address = addressFormat;

  const quoteNum = quote?.quote_num;
  return (
    <View style={styles.headingContainer}>
      <Image style={styles.logo} src={logo} />
      <View>
        <Text style={styles.headingTitle}>SCAFFOLD QUOTE</Text>
      </View>
      <View style={styles.headingContact}>
        <View style={styles.headingDisplay}>
          <Text style={styles.headingText}>Date:</Text>
          <Text style={styles.subText}>{moment(quote.created_at).format("DD/MM/YYYY")}</Text>
        </View>
        <View style={styles.headingDisplay}>
          <Text style={styles.headingText}>Quote #:</Text>
          <Text style={styles.subText}>{quoteNum}</Text>
        </View>
        <View style={styles.headingDisplay}>
          <Text style={styles.headingText}>Estimator:</Text>
          <Text style={styles.subText}>{staffName || " "}</Text>
        </View>
        <View style={styles.headingDisplay}>
          <Text style={styles.headingText}>Contact:</Text>
          <Text style={styles.subText}>{staffPhone || " "}</Text>
        </View>
        <View style={styles.headingDisplay}>
          <Text style={styles.headingText}>Email:</Text>
          <Text style={styles.subText}>{staffEmail || " "}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: 150,
    alignItems: "left",
    fontFamily: "Open Sans",
    fontWeight: "semibold",
    color: "#1A8140",
    marginTop: 8,
  },
  headingTitle: {
    paddingTop: 15,
    fontFamily: "Open Sans",
    fontSize: 15,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20,
    // fontSize: 12,
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
    // fontWeight: "semibold",
    fontSize: 8,
  },
  subText: {
    fontFamily: "Open Sans",
    marginLeft: 4,
    fontSize: 8,
    // fontWeight: "semibold",
  },
  logo: {
    objectFit: "contain",
    width: "25%",
    height: "auto",
    paddingTop: 15,
  },
});


