import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { router } from "expo-router";
import API from "../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      const response = await API.post(
        "/login",
        {
          phone,
          password,
        }
      );

      if (response.data.success) {

        await AsyncStorage.setItem(
          "token",
          response.data.token
        );

        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🧠</Text>

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push("/register")
        }
      >
        <Text style={styles.register}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F8FAFC",
  },

  logo: {
    textAlign: "center",
    fontSize: 70,
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 15,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  register: {
    marginTop: 20,
    textAlign: "center",
    color: "#2563EB",
  },
});