import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import HomeHeader from "./HomeHeader";
import SettingsHeader from "./SettingsHeader";
import { ChatContext } from "../../context/ChatContext";

export default function index() {
  const { tabName } = useContext(ChatContext);
  if (tabName === "Chats") return <HomeHeader />;
  if (tabName === "Settings") return <SettingsHeader />;
}
