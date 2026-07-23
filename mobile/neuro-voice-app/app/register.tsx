import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import API from "../src/services/api";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await API.post("/register", {
        full_name: fullName,
        phone,
        password,
        age,
      });

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Registration Successful"
        );

        router.replace("/login");
      }
    } catch (error: any) {
      console.log("REGISTER ERROR:", error);
      console.log("RESPONSE:", error?.response?.data);

      Alert.alert(
        "Error",
        JSON.stringify(error?.response?.data || error?.message)
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.logo}>🧠</Text>

      <Text style={styles.heading}>
        Create Account
      </Text>

      <Text style={styles.subtitle}>
        Neuro Voice Companion
      </Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        style={styles.input}
        value={age}
        onChangeText={setAge}
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
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/login")}
      >
        <Text style={styles.loginText}>
          Already have an account?
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F8FAFC",
  },

  logo: {
    textAlign: "center",
    fontSize: 70,
  },

  heading: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 15,
    marginTop: 10,
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  loginText: {
    textAlign: "center",
    marginTop: 20,
    color: "#2563EB",
  },
});