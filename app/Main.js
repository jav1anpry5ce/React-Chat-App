import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { Login, Home, Chat, Settings, Signup } from "./screens";
import { ChatContext } from "./context/ChatContext";
import ChatHeader from "./components/ChatHeader";
import Icon from "react-native-vector-icons/Ionicons";
import { Header } from "./components";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const UnAuthNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};

const ChatHome = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#202736",
          borderTopColor: "#111827",
        },
      })}
    >
      <Tab.Screen
        name="Chats"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              name="chatbox"
              size={24}
              color={focused ? "#ff6666" : "#fff"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              name="settings"
              size={24}
              color={focused ? "#ff6666" : "#fff"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AuthNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "",
        headerStyle: {
          backgroundColor: "#111827",
          shadowColor: "transparent",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={ChatHome}
        options={({ route }) => ({
          header: () => <Header route={route} />,
        })}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          header: () => <ChatHeader />,
        }}
      />
    </Stack.Navigator>
  );
};

export default function Main() {
  const { user } = useContext(ChatContext);
  if (user) return <AuthNav />;
  return <UnAuthNav />;
}
