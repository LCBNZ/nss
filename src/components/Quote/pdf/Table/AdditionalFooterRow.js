import React from "react";
import { Text, Font, View, StyleSheet } from "@react-pdf/renderer";
import { numberFormat } from "../../../../utils";

const borderColor = "#E5E7EB";

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
    alignItems: "center",
    height: 13,
    fontFamily: "Open Sans",
    fontSize: 8,
    fontWeight: "semibold",
    color: "#1F2937",
  },
  description: {
    width: "24%",
    textAlign: "right",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  quantityTotal: {
    width: "19%",
    textAlign: "right",
    paddingRight: 8,
    paddingLeft: 8,
    fontFamily: "Open Sans",
    fontWeight: "bold",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  fixedTotal: {
    width: "17%",
    textAlign: "left",
    paddingLeft: 8,
    fontFamily: "Open Sans",
    fontWeight: "bold",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  weeklyTotal: {
    width: "25%",
    textAlign: "left",
    paddingLeft: 8,
    fontFamily: "Open Sans",
    fontWeight: "bold",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },

  total: {
    width: "15%",
    textAlign: "left",
    paddingLeft: 8,
    fontFamily: "Open Sans",
    fontWeight: "bold",
  },
});

export const AdditionalFooterRow = ({ items }) => {
  const total = items
    .map((item) => item.total)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const fixedCharge = items
    .map((item) => Number(item.fixed_charge))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const hireFee = items
    .map((item) => Number(item.hire_fee))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (
    <View style={styles.row}>
      <Text style={styles.description} />
      <Text style={styles.quantityTotal}>Total</Text>
      <Text style={styles.fixedTotal}>{numberFormat.format(fixedCharge)}</Text>
      <Text style={styles.weeklyTotal}>{numberFormat.format(hireFee)}</Text>
      <Text style={styles.total}>{numberFormat.format(total)}</Text>
    </View>
  );
};
