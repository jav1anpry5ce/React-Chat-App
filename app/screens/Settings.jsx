import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ChatContext } from "../context/ChatContext";
import { Button } from "../components";

export default function Settings() {
  const { logout, setTabName, user } = useContext(ChatContext);
  useFocusEffect(
    useCallback(() => {
      setTabName("Settings");
    }, [])
  );
  return (
    <View style={styles.container}>
      <View style={styles.profileWrapper}>
        <Image source={{ uri: user.image }} style={styles.image} />
        <Text style={styles.name}>{user.name}</Text>
      </View>
      <Button onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#111827",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  profileWrapper: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    resizeMode: "cover",
  },
  name: {
    fontSize: 22,
    color: "#fff",
  },
});
