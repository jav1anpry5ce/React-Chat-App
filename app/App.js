import { ChatProvider } from "./context/ChatContext";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import Main from "./Main";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function App() {
  return (
    <ChatProvider>
      <NavigationContainer>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Main />
        </KeyboardAvoidingView>
      </NavigationContainer>
    </ChatProvider>
  );
}
