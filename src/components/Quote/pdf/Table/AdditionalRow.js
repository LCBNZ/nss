import React, { Fragment } from "react";

import { Text, View, Font, StyleSheet } from "@react-pdf/renderer";
import { numberFormat } from "../../../../utils";

const borderColor = "#F3F4F6";

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
    flexGrow: 1,
    flexDirection: "row",
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
    fontFamily: "Open Sans",
    fontSize: 7,
  },
  type: {
    fontWeight: 600,
  },
  description: {
    textWrap: "nowrap",
    textOverflow: "ellipsis",
    flexDirection: "column",
    textAlign: "left",
    width: "24%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
  },
  additionalDuration: {
    width: "19%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
  charge: {
    width: "17%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
  weekly: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
  additionalTotal: {
    width: "15%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
});
// fixed_charge hire_fee total
export const AdditionalRow = ({ items }) => {
  const rows = items.map((item) => {
    const description = [];
    if (item.type) description.push(item.type);
    if (item.description) description.push(item.description);

    console.log("description", description);
    const descriptionText = description.join(" - ");
    return (
      <View style={styles.row}>
        <View style={styles.description}>
          {item.type ? (
            <Text style={styles.type}>
              {item.type} {item.type && item.description ? " - " : ""}
            </Text>
          ) : null}
          <Text>{item.description}</Text>
        </View>
        <Text style={styles.additionalDuration}>{item.duration}</Text>
        <Text style={styles.charge}>{numberFormat.format(item.fixed_charge)}</Text>
        <Text style={styles.weekly}>{numberFormat.format(item.hire_fee)}</Text>
        <Text style={styles.additionalTotal}>{numberFormat.format(item.total)}</Text>
      </View>
    );
  });

  return <>{rows}</>;
};
