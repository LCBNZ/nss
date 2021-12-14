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

export const ClientInfo = ({ quote }) => {
  const fields = [[quote.street_1], [quote.street_2], [quote.city]];
  const addressFormat = fields
    .map((part) => part.filter(Boolean).join(" "))
    .filter((str) => str.length)
    .join(", ");

  const client = quote?.clients?.client_name;
  const contact = quote?.client_contacts?.name;
  const contactPhone = quote?.client_contacts?.phone;
  const contactEmail = quote?.client_contacts?.email;

  const street1 = quote?.street_1;
  const street2 = quote?.street_2;
  const city = quote?.city;
  const postCode = quote?.post_code;
  const address = addressFormat;
  return (
    <View style={styles.headingContainer}>
      <View style={styles.clientContainer}>
        <View style={styles.headingContact}>
          <View style={styles.headingDisplay}>
            <Text style={styles.headingText}>Client:</Text>
          </View>
          <View style={styles.headingDisplay}>
            <Text style={styles.headingText}>Contact Name:</Text>
          </View>
          <View style={styles.headingDisplay}>
            <Text style={styles.headingText}>Contact Email:</Text>
          </View>
          <View style={styles.headingDisplay}>
            <Text style={styles.headingText}>Contact Number:</Text>
          </View>
        </View>
        <View>
          <Text style={styles.subText}>{client || " "}</Text>
          <Text style={styles.subText}>{contact || " "}</Text>
          <Text style={styles.subText}>{contactEmail || " "}</Text>
          <Text style={styles.subText}>{contactPhone || " "}</Text>
        </View>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.headingDisplay}>
          <Text style={styles.headingText}>Install Address:</Text>
          <View>
            <View>{street1 ? <Text style={styles.subText}>{street1},</Text> : null}</View>
            <View>{street2 ? <Text style={styles.subText}>{street2},</Text> : null}</View>
            <View>{city ? <Text style={styles.subText}>{city}</Text> : null}</View>
            <View>{postCode ? <Text style={styles.subText}>{postCode}</Text> : null}</View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20,
    width: "80%",
    // fontSize: 12,
  },
  clientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  addressContainer: {
    textAlign: "right",
    marginTop: 20,
    paddingRight: 8,
  },
  headingContact: {
    textAlign: "right",
    // marginTop: 20,
    paddingRight: 8,
    marginRight: 8,
  },
  headingDisplay: {
    display: "flex",
    flexDirection: "row",
  },
  headingText: {
    fontFamily: "Open Sans",
    fontWeight: "semibold",
    fontSize: 9,
  },
  subText: {
    fontFamily: "Open Sans",
    marginLeft: 4,
    fontSize: 9,
    // fontWeight: "semibold",
  },
  logo: {
    objectFit: "contain",
    width: "25%",
    height: "auto",
    paddingTop: 15,
  },
});
