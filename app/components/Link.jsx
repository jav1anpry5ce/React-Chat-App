import { StyleSheet, Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";

export default function Link({ screen, children }) {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate(screen);
  };
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
