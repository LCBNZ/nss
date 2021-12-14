import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 36,
  },
  personDetails: {},
  quoteDetails: {},
});

export const Billing = ({ invoice }) => (
  <View style={styles.headerContainer}>
    <View style={styles.personDetails}>
      <Text>Test Company</Text>
      <Text>Joe Doe</Text>
      <Text>joe@doe.com</Text>
    </View>
    <View style={styles.quoteDetails}>
      <Text>5065</Text>
      <Text>27/08/2021</Text>
      <Text>Quote Description</Text>
    </View>
  </View>
);

