import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Card({ children }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#242d3c",
    padding: 10,
    borderRadius: 5,
    gap: 10,
    minHeight: 250,
    width: "100%",
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
