import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { styles } from "./styles";

export const Header = ({ columns }) => (
  <View style={styles.container}>
    {columns.map((column) => (
      <Text style={styles[column?.id]}>{column.heading}</Text>
    ))}
  </View>
);
