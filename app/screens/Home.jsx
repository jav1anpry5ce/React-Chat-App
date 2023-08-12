import { StyleSheet, ScrollView } from "react-native";
import { useCallback, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Chat } from "../components";
import { useFocusEffect } from "@react-navigation/native";

export default function Home() {
  const { chats, setTabName } = useContext(ChatContext);
  useFocusEffect(
    useCallback(() => {
      setTabName("Chats");
    }, [])
  );
  return (
    <ScrollView style={styles.container}>
      {chats.map((chat) => (
        <Chat key={chat.id} chat={chat} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#111827",
    padding: 10,
  },
});
