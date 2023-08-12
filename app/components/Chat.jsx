import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function Chat({ chat }) {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("Chat", { id: chat.id });
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image source={{ uri: chat.image }} style={styles.image} />
      <View style={styles.column}>
        <Text style={styles.name}>{chat.name}</Text>
        <Text style={styles.text} numberOfLines={1}>
          {chat.chatType === "group" &&
            "~ " + chat.messages.at(-1).sender.username + ": "}
          {RenderLastMessage(chat)}
        </Text>
      </View>
      {chat.unread > 0 && (
        <View style={styles.unread}>
          <Text style={styles.text}>{chat.unread}</Text>
        </View>
      )}
    </Pressable>
  );
}

const RenderLastMessage = (chat) => {
  if (chat.lastMessage.type === "text")
    return (
      <Text style={styles.text} numberOfLines={1}>
        {chat.lastMessage.text}
      </Text>
    );
  if (chat.lastMessage.type === "image")
    return (
      <Text style={styles.text} numberOfLines={1}>
        <Icon name="photo-video" /> Photo
      </Text>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomColor: "#64748b",
    borderBottomWidth: 1,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 999,
    marginVertical: 5,
  },
  name: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
    color: "#fff",
  },
  unread: {
    color: "#fff",
    backgroundColor: "#059669",
    height: 30,
    width: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
