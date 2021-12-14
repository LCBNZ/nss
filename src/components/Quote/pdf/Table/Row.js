import React, { Fragment } from "react";

import { Text, View, Font, StyleSheet } from "@react-pdf/renderer";
import { RowGroup } from "./Group";

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
    fontSize: 7.4,
  },
  description: {
    textWrap: "nowrap",
    textOverflow: "ellipsis",
    flexDirection: "column",
    width: "20%",
    textAlign: "left",
    // minWidth: "20%",
    // maxWidth: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
  },
  type: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
  erect: {
    width: "18%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
  rate: {
    width: "12%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
  duration: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
  weekly: {
    width: "18%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
  },
  total: {
    width: "15%",
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
  },
});

export const Row = ({ items, groupable = false }) => {
  const groupBy = function (xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const grouped = groupBy(items, "zone_label");

  let rows;
  if (groupable) {
    rows = Object.entries(grouped).map((item) => (
      <>
        <RowGroup text={item[0]} />
        {item[1].map((row) => (
          <>
            <View style={styles.row}>
              <Text style={styles.description}>{row.description}</Text>
              <Text style={styles.erect}>{`${numberFormat.format(
                Number(row.erect_dismantle),
              )}`}</Text>
              <Text style={styles.type}>{numberFormat.format(Number(row.transport))}</Text>
              <Text style={styles.duration}>{row.weekly_duration}</Text>
              <Text style={styles.weekly}>{`${numberFormat.format(Number(row.weekly_fee))}`}</Text>
              <Text style={styles.total}>{`${numberFormat.format(Number(row.total))}`}</Text>
            </View>
          </>
        ))}
      </>
    ));
  } else {
    rows = items.map((item) => (
      <View style={styles.row}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.erect}>{item.erect_dismantle}</Text>
        <Text style={styles.duration}>{item.weekly_duration}</Text>
        <Text style={styles.duration}>{item.weekly_fee}</Text>
        <Text style={styles.amount}>{item.total}</Text>
      </View>
    ));
  }

  return <>{rows}</>;
};

/*
  zone_label (Grouping)

  description
  type
  erect_dismantle
  weekly_duration
*/
