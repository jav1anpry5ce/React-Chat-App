import { StyleSheet, ScrollView } from "react-native";
import Text from "./Text";
import { useRef } from "react";
import Image from "./Image";

export default function index({ messages }) {
  const scrollViewRef = useRef(null);
  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={(width, height) =>
        scrollViewRef.current.scrollToEnd()
      }
      onScrollToTop={() => {
        scrollViewRef.current.scrollTo({
          x: 0,
          y: 0,
          animate: true,
        });
      }}
      style={styles.container}
    >
      {renderMessages(messages)}
    </ScrollView>
  );
}

const renderMessages = (messages) => {
  return messages?.map((message) => {
    if (message.message?.wasUnsent)
      return <Text key={message.id} message={message} />;
    if (message.message?.type === "text")
      return <Text key={message.id} message={message} />;
    if (message.message?.type === "image")
      return <Image key={message.id} message={message} />;
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
});
