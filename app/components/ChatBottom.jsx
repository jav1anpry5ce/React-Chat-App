import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { useState, useContext } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { ChatContext } from "../context/ChatContext";
import * as ImagePicker from "expo-image-picker";

export default function ChatBottom() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const { sendMessage, chatting } = useContext(ChatContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFileName(result.assets[0].fileName);
      setImage(result.assets[0].uri);
      const data = {
        conversationId: chatting.id,
        text: message,
        chatType: chatting.chatType,
        file: result.assets[0],
      };
      sendMessage(data);
    }
  };

  const handelSend = () => {
    if (message === "") return;
    const data = {
      conversationId: chatting.id,
      text: message,
      chatType: chatting.chatType,
    };
    sendMessage(data);
    setMessage("");
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage}>
        <MaterialIcon name="perm-media" size={25} color="#fff" />
      </Pressable>
      <View style={styles.input}>
        <TextInput
          placeholderTextColor="#fff"
          placeholder="Type a message"
          style={styles.inputText}
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline
          keyboardAppearance="dark"
        />
      </View>
      <Pressable style={styles.send} onPress={handelSend}>
        <Icon name="send" size={25} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#455366",
    // maxHeight: 100,
  },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  inputText: {
    color: "white",
    flex: 1,
  },
  send: {
    backgroundColor: "#60a5fa",
    borderRadius: 999,
    padding: 5,
  },
});
