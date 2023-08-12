import { StyleSheet, Text, View, Image as Img } from "react-native";
import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

export default function Image({ message }) {
  const { user } = useContext(ChatContext);
  return (
    <View
      style={
        message.sender.username === user.username
          ? message.message?.text
            ? styles.senderText
            : styles.sender
          : message.message?.text
          ? styles.receiverText
          : styles.receiver
      }
    >
      <Img
        source={{ uri: message.message?.file }}
        style={message.message.text ? styles.imageText : styles.image}
      />
      {message.message?.text !== "" && (
        <Text style={styles.text}>{message.message.text}</Text>
      )}
      <View style={message.message.text ? styles.timeText : styles.time}>
        <Text style={{ color: "#fff", fontSize: 12 }}>
          {new Date(message.time)
            .toLocaleTimeString()
            .replace(/(.*)\D\d+/, "$1")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sender: {
    minWidth: "30%",
    maxWidth: "80%",
    marginVertical: 3,
    alignSelf: "flex-end",
  },
  senderText: {
    backgroundColor: "#3777f0",
    borderRadius: 10,
    paddingBottom: 5,
    minWidth: "30%",
    maxWidth: "80%",
    marginVertical: 3,
    alignSelf: "flex-end",
  },
  receiver: {
    minWidth: "30%",
    maxWidth: "80%",
    marginVertical: 3,
    alignSelf: "flex-start",
  },
  receiverText: {
    backgroundColor: "#222b3d",
    borderRadius: 10,
    paddingBottom: 5,
    minWidth: "30%",
    maxWidth: "80%",
    marginVertical: 3,
    alignSelf: "flex-start",
  },
  image: {
    width: 225,
    aspectRatio: 1 / 1.7,
    resizeMode: "cover",
    borderRadius: 5,
  },
  imageText: {
    width: 225,
    aspectRatio: 1 / 1.7,
    resizeMode: "cover",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  time: {
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(5px)",
    borderRadius: 10,
    fontSize: 12,
    color: "#fff",
    alignSelf: "flex-end",
    paddingHorizontal: 5,
    position: "absolute",
    bottom: 3,
  },
  timeText: {
    fontSize: 12,
    color: "#fff",
    alignSelf: "flex-end",
    paddingHorizontal: 5,
    paddingVertical: 5,
    position: "absolute",
    bottom: 0,
  },
});
