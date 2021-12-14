import React from "react";
import { Text, View, Font, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    marginTop: 10,
    borderTopColor: "#F3F4F6",
    borderTopWidth: 1,
  },
  heading: {
    fontFamily: "Open Sans",
    fontWeight: "semibold",
    marginTop: 12,
    fontSize: 9,
    color: "#1A8140",
  },
  description: {
    fontFamily: "Open Sans",
    fontSize: 7,
    marginBottom: 12,
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

export const Description = ({ description }) => (
  <View style={styles.headerContainer}>
    <View>
      <Text style={styles.heading}>Description / Notes:</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
);
