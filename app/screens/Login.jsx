import { StyleSheet, Text, View } from "react-native";
import { Card, Input, Button, Link } from "../components";
import axios from "axios";
import { useContext, useState } from "react";
import { storeData } from "../utils/storage";
import { ChatContext } from "../context/ChatContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(ChatContext);

  const handelLogin = () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      username,
      password,
    };

    axios
      .post(`${process.env.REACT_APP_API_URI}/api/login`, data, config)
      .then((res) => {
        // socket.emit("getChats", res.data.username);
        const user = {
          username: res.data.username,
          name: res.data.name,
          image: res.data.image,
          token: res.data.token
        };
        storeData("user", user)
          .then(() => {
            setUser(user);
            setLoading(false);
          })
          .catch(() => {
            setError({ message: "Something went wrong" });
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.header}>Login</Text>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {error && <Text style={styles.error}>{error.message}</Text>}
        <Button onPress={handelLogin} loading={loading}>
          <Text>Login</Text>
        </Button>
        <Link screen="Signup">
          <Text>Don't have an account? Register here</Text>
        </Link>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "bold",
    color: "white",
  },
  error: {
    color: "#ff726f",
    fontSize: 14,
    marginLeft: 4,
    marginTop: -8,
  },
});
