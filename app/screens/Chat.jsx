import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { ChatBottom, Messages } from "../components";

export default function Chat({ route }) {
  const { id } = route.params;
  const { chats, chatting, setChatting, setZero } = useContext(ChatContext);

  useEffect(() => {
    setChatting(chats.find((chat) => chat.id === id));
  }, [chats]);

  useEffect(() => {
    setZero(id);
  }, [chatting]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://brunty.me/files/chat-bgs/1.0/blue-pink-20-pct.png",
        }}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <Messages messages={chatting?.messages} />
        <ChatBottom />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#455366",
  },
});
