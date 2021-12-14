import { StyleSheet, Font } from "@react-pdf/renderer";

const borderColor = "#D1D5DB";

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

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "row",
    paddingVertical: 2,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    textAlign: "left",
    color: "#1F2937",
    fontFamily: "Open Sans",
    fontSize: 9,
    fontWeight: "semibold",
  },
  description: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "left",
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  type: {
    minWidth: "15%",
    maxWidth: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  erect: {
    width: "18%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  rate: {
    width: "12%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  duration: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  fee: {
    width: "18%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  total: {
    width: "15%",
    paddingLeft: 8,
    fontSize: 7.6,
  },

  // Zones
  zone: {
    width: "8%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  label: {
    width: "30%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  erectZone: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  hireTotal: {
    width: "22%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  zoneTotal: {
    width: "15%",
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },

  // Additional Items
  additionalDesc: {
    width: "24%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  additionalDuration: {
    width: "19%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  charge: {
    width: "17%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  weekly: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
  additionalTotal: {
    width: "15%",
    paddingLeft: 8,
    paddingRight: 3,
    fontSize: 7.6,
  },
});
