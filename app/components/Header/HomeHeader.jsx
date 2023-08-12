import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      <Icon name="create" size={24} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 95,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  header: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
