import React from "react";
import { Text, View, Font, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  heading: {
    fontFamily: "Open Sans",
    fontWeight: "semibold",
    fontSize: 9,
    color: "#1A8140",
  },
  description: {
    fontFamily: "Open Sans",
    fontSize: 6,
  },
});

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

export const Terms = ({ totalPages, pageNumber, terms }) => {
  if (totalPages === pageNumber) {
    return (
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.heading}>Schedule of Rates</Text>
          <Text style={styles.description}>{terms.replace(/\n\n/g, "\n")}</Text>
        </View>
      </View>
    );
  }
  return <View>ffsdf</View>;
};
