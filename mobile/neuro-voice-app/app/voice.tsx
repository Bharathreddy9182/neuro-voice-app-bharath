import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Voice from "@react-native-voice/voice";
import * as Speech from "expo-speech";

import API from "../src/services/api";

export default function VoiceScreen() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [manualText, setManualText] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const startListening = async () => {
    try {
      setListening(true);
      await Voice.start("en-US");
    } catch (error) {
      console.log(error);
      setListening(false);

      Alert.alert(
        "Voice Error",
        "Voice recognition is unavailable."
      );
    }
  };

  const sendToAI = async (message: string) => {
    if (!message.trim()) {
      Alert.alert(
        "Validation",
        "Please enter or speak a message."
      );
      return;
    }

    try {
      setLoading(true);

      const userData =
        await AsyncStorage.getItem("user");

      const user =
        JSON.parse(userData || "{}");

      const response =
        await API.post("/ai/chat", {
          user_id: user.id,
          message,
        });

      const aiReply =
        response.data.reply || "";

      setReply(aiReply);

      Speech.speak(aiReply);

    } catch (error: any) {
  console.log(
    "AI ERROR:",
    error?.response?.data
  );

  Alert.alert(
    "AI Error",
    JSON.stringify(
      error?.response?.data ||
      error?.message
    )
  );
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      const speech =
        event.value?.[0] || "";

      setText(speech);

      sendToAI(speech);

      setListening(false);
    };

    Voice.onSpeechError = (event) => {
      console.log(
        "VOICE ERROR:",
        event
      );

      setListening(false);
    };

    return () => {
      Voice.destroy()
        .then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.title}>
        🧠 Neuro Voice Assistant
      </Text>

      <TouchableOpacity
        style={[
          styles.mic,
          listening &&
            styles.activeMic,
        ]}
        onPress={startListening}
      >
        <Text style={styles.micText}>
          🎤
        </Text>
      </TouchableOpacity>

      <Text style={styles.status}>
        {listening
          ? "Listening..."
          : "Tap microphone to speak"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Or type your question..."
        value={manualText}
        onChangeText={setManualText}
      />

      <TouchableOpacity
        style={styles.sendButton}
        onPress={() =>
          sendToAI(manualText)
        }
      >
        <Text
          style={styles.sendText}
        >
          Ask AI
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>
        You Said
      </Text>

      <View style={styles.card}>
        <Text>
          {text ||
            manualText ||
            "-"}
        </Text>
      </View>

      <Text style={styles.label}>
        AI Reply
      </Text>

      <View
        style={[
          styles.card,
          styles.replyCard,
        ]}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text>
            {reply || "-"}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor:
        "#F8FAFC",
      justifyContent:
        "center",
    },

    title: {
      fontSize: 28,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 30,
    },

    mic: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor:
        "#2563EB",
      justifyContent:
        "center",
      alignItems: "center",
      alignSelf: "center",
    },

    activeMic: {
      backgroundColor:
        "#16A34A",
    },

    micText: {
      fontSize: 60,
    },

    status: {
      textAlign: "center",
      marginTop: 15,
      marginBottom: 20,
      color: "#64748B",
    },

    input: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
    },

    sendButton: {
      backgroundColor:
        "#2563EB",
      padding: 15,
      borderRadius: 15,
      marginBottom: 20,
    },

    sendText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "700",
      fontSize: 16,
    },

    label: {
      fontWeight: "700",
      fontSize: 16,
      marginBottom: 8,
      marginTop: 10,
    },

    card: {
      backgroundColor:
        "#FFFFFF",
      padding: 15,
      borderRadius: 15,
      minHeight: 70,
    },

    replyCard: {
      backgroundColor:
        "#DBEAFE",
    },
  });