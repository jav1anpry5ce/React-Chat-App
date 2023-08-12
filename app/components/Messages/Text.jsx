import { StyleSheet, Text as Txt, View } from "react-native";
import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

export default function Text({ message }) {
  const { user } = useContext(ChatContext);
  if (message.message.wasUnsent) {
    return (
      <Txt
        style={
          message.sender.username === user.username
            ? styles.unsentSender
            : styles.unsentReceiver
        }
      >
        This message was unsent
      </Txt>
    );
  }
  return (
    <View
      style={
        message.sender.username === user.username
          ? styles.sender
          : styles.receiver
      }
    >
      <Txt style={styles.text}>{message.message.text}</Txt>
      <Txt style={styles.time}>
        {new Date(message.time).toLocaleTimeString().replace(/(.*)\D\d+/, "$1")}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  sender: {
    backgroundColor: "#3777f0",
    borderRadius: 10,
    padding: 10,
    minWidth: "30%",
    maxWidth: "80%",
    marginVertical: 3,
    alignSelf: "flex-end",
  },
  receiver: {
    backgroundColor: "#222b3d",
    borderRadius: 10,
    padding: 10,
    minWidth: "30%",
    maxWidth: "80%",
    marginVertical: 3,
    alignSelf: "flex-start",
  },
  unsentSender: {
    borderRadius: 10,
    padding: 10,
    minWidth: "30%",
    maxWidth: "80%",
    marginVertical: 3,
    alignSelf: "flex-end",
    color: "#fff",
    fontSize: 10,
    fontStyle: "italic",
  },
  unsentReceiver: {
    borderRadius: 10,
    padding: 10,
    minWidth: "30%",
    maxWidth: "80%",
    marginVertical: 3,
    alignSelf: "flex-start",
    color: "#fff",
    fontSize: 10,
    fontStyle: "italic",
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
  time: {
    fontSize: 12,
    color: "#fff",
    alignSelf: "flex-end",
  },
});
