import React, { Fragment } from "react";

import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { numberFormat } from "../../../../utils";

const borderColor = "#F3F4F6";

const styles = StyleSheet.create({
  row: {
    flexGrow: 1,
    flexDirection: "row",
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
    fontStyle: "bold",
  },
  zone: {
    width: "8%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    paddingLeft: 8,
    paddingRight: 3,
  },
  label: {
    textWrap: "nowrap",
    textOverflow: "ellipsis",
    flexDirection: "column",
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
  },
  erect: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    paddingLeft: 8,
    paddingRight: 3,
  },
  hireTotal: {
    width: "22%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    paddingLeft: 8,
    paddingRight: 3,
  },
  zoneTotal: {
    width: "15%",
    textAlign: "center",
    paddingLeft: 8,
    paddingRight: 3,
  },
});

export const ZoneRow = ({ items }) => {
  const zoneRows = items.reverse();
  const rows = zoneRows.map((item) => (
    <View style={styles.row}>
      <Text style={styles.zone}>{item.zone}</Text>
      <Text style={styles.label}>{item.zone_label}</Text>
      <Text style={styles.erect}>{numberFormat.format(item.erect_dismantle)}</Text>
      <Text style={styles.hireTotal}>{`${numberFormat.format(
        item.weekly_fee,
      )}`}</Text>
      <Text style={styles.zoneTotal}>{`${numberFormat.format(
        item.total,
      )}`}</Text>
    </View>
  ));

  return <>{rows}</>;
};
