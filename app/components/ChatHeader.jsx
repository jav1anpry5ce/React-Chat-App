import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function ChatHeader() {
  const { chatting, socket } = useContext(ChatContext);
  const [online, setOnline] = useState(false);
  const [typing, setTyping] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setOnline(false);
    socket.on("online", ({ username, online }) => {
      if (username === chatting?.username) {
        setOnline(online);
      }
    });
    socket.on("usertyping", (data) => {
      if (chatting) {
        if (data.typing === chatting.username) {
          if (!typing) setTyping(true);
        } else {
          if (typing) setTyping(false);
        }
      }
    });
    return () => {
      socket.off("online");
      socket.off("usertyping");
    };
    // eslint-disable-next-line
  }, [chatting]);

  useEffect(() => {
    setTimeout(() => {
      if (typing) setTyping(false);
    }, 5000);
  }, [typing]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-sharp" size={25} color="#fff" />
        </Pressable>
        <View style={styles.user}>
          <Image
            source={{ uri: chatting?.image }}
            style={{ width: 45, height: 45, borderRadius: 25 }}
          />
          <View>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {chatting?.name}
            </Text>
            {typing && (
              <Text style={{ color: "#fff", fontSize: 12 }}>typing...</Text>
            )}
            {online && !typing && (
              <Text style={{ color: "#fff", fontSize: 12 }}>online</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#222b3d",
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    paddingHorizontal: 5,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    gap: 5,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
