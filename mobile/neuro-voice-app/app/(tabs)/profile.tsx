import React, {
  useEffect,
  useState
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import API from "../../src/services/api";

export default function ProfileScreen() {

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    const userData =
      await AsyncStorage.getItem("user");

    const user =
      JSON.parse(userData || "{}");

    const response =
      await API.get(
        `/profile/${user.id}`
      );

    setProfile(response.data);
  };

  const logout = async () => {

    await AsyncStorage.clear();

    router.replace("/login");
  };

  return (
    <ScrollView
      style={styles.container}
    >

      <View style={styles.header}>

        <Text style={styles.avatar}>
          👤
        </Text>

        <Text style={styles.name}>
          {profile?.full_name}
        </Text>

        <Text style={styles.sub}>
          Neuro Voice Companion
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Phone
        </Text>

        <Text style={styles.value}>
          {profile?.phone}
        </Text>

        <Text style={styles.label}>
          Age
        </Text>

        <Text style={styles.value}>
          {profile?.age}
        </Text>

      </View>

      <Text style={styles.section}>
        📊 Statistics
      </Text>

      <View style={styles.statsRow}>

        <View style={styles.statCard}>
          <Text style={styles.number}>
            {profile?.memories || 0}
          </Text>

          <Text>
            Memories
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.number}>
            {profile?.reminders || 0}
          </Text>

          <Text>
            Reminders
          </Text>
        </View>

      </View>

      <View style={styles.statsRow}>

        <View style={styles.statCard}>
          <Text style={styles.number}>
            {profile?.medications || 0}
          </Text>

          <Text>
            Medicines
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.number}>
            {profile?.contacts || 0}
          </Text>

          <Text>
            Contacts
          </Text>
        </View>

      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F8FAFC"
  },

  header:{
    backgroundColor:"#2563EB",
    alignItems:"center",
    padding:30
  },

  avatar:{
    fontSize:70
  },

  name:{
    color:"#fff",
    fontSize:24,
    fontWeight:"700"
  },

  sub:{
    color:"#DBEAFE"
  },

  card:{
    backgroundColor:"#fff",
    margin:20,
    borderRadius:20,
    padding:20
  },

  label:{
    color:"#64748B",
    marginTop:10
  },

  value:{
    fontSize:18,
    fontWeight:"700"
  },

  section:{
    fontSize:20,
    fontWeight:"700",
    marginHorizontal:20,
    marginBottom:15
  },

  statsRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginHorizontal:20,
    marginBottom:15
  },

  statCard:{
    backgroundColor:"#fff",
    width:"48%",
    padding:20,
    borderRadius:18,
    alignItems:"center"
  },

  number:{
    fontSize:28,
    fontWeight:"700",
    color:"#2563EB"
  },

  logoutBtn:{
    backgroundColor:"#DC2626",
    margin:20,
    padding:18,
    borderRadius:15
  },

  logoutText:{
    color:"#fff",
    textAlign:"center",
    fontWeight:"700"
  }

});