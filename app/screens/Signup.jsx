import { StyleSheet, Text, View } from "react-native";
import { Card, Input, Button, Link } from "../components";
import axios from "axios";
import { useState } from "react";

export default function Login({ navigator }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handelRegister = () => {
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      username,
      password,
      name,
      image_url: imageUrl,
    };

    axios
      .post(`https://api.chatapp.home/api/signup`, data, config)
      .then(() => {
        setLoading(false);
        navigator.navigate("Login");
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
        <Text style={styles.header}>Register</Text>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          error={error?.name ? error.name : false}
        />
        <Input
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          error={error?.username ? error.username : false}
        />
        <Input
          placeholder="Image url"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          error={error?.image_url ? error.image_url : false}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          error={error?.password ? error.password : false}
        />
        <Input
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          error={error?.password ? error.password : false}
        />

        {error && <Text style={styles.error}>{error.message}</Text>}
        <Button onPress={handelRegister} loading={loading}>
          <Text>Register</Text>
        </Button>
        <Link screen="Login">
          <Text>Already have an account? login</Text>
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
