import React, { Fragment } from "react";
import { Text, View, Font, StyleSheet } from "@react-pdf/renderer";

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

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 13,
    fontFamily: "Open Sans",
    fontSize: 8,
    fontWeight: "semibold",
    color: "white",
    backgroundColor: "#F9FAFB",
  },
  blankRow: {
    width: "100%",
    color: "#1F2937",
    paddingLeft: 8,
  },
});

export const RowGroup = ({ text }) => (
  <View style={styles.row}>
    <Text style={styles.blankRow}>{text}</Text>
  </View>
);
