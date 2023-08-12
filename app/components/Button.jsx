import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";

export default function Button({ onPress, loading, children }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.layout}>
        <Text style={styles.text}>{children}</Text>
        {loading && <ActivityIndicator color="blue" />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#aa54f4",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  layout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
