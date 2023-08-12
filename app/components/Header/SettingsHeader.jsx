import { StyleSheet, Text, View } from "react-native";

export default function SettingsHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 95,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
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
    textAlign: "center",
  },
});
