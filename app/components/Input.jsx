import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

export default function Input(props) {
  return (
    <View>
      <View style={styles.container}>
        <TextInput
          placeholderTextColor="#ababab"
          style={styles.input}
          {...props}
          keyboardAppearance="dark"
        />
      </View>
      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#374151",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    height: 45,
  },
  input: {
    color: "white",
    width: "100%",
    height: "100%",
  },
  error: {
    color: "#f2564b",
    paddingTop: 3,
    paddingLeft: 5,
  },
});
