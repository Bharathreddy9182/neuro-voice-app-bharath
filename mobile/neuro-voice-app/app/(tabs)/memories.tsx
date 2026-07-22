import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
FlatList,
TextInput,
TouchableOpacity,
Alert,
RefreshControl,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";

export default function MemoriesScreen() {

const [memoryText, setMemoryText] =
useState("");

const [memories, setMemories] =
useState<any[]>([]);

const [refreshing, setRefreshing] =
useState(false);

useEffect(() => {
loadMemories();
}, []);

const loadMemories = async () => {


try {

  setRefreshing(true);

  const userData =
    await AsyncStorage.getItem("user");

  if (!userData) return;

  const user =
    JSON.parse(userData);

  const response =
    await API.get(
      `/memories/${user.id}`
    );

  setMemories(response.data);

} catch (error) {
  console.log(error);
} finally {
  setRefreshing(false);
}


};

const addMemory = async () => {


if (!memoryText.trim()) {
  Alert.alert(
    "Validation",
    "Please enter a memory"
  );
  return;
}

try {

  const userData =
    await AsyncStorage.getItem("user");

  const user =
    JSON.parse(userData || "{}");

  await API.post(
    "/memories",
    {
      user_id: user.id,
      memory_text: memoryText,
    }
  );

  Alert.alert(
    "Success",
    "Memory saved"
  );

  setMemoryText("");

  loadMemories();

} catch (error) {

  console.log(error);

  Alert.alert(
    "Error",
    "Unable to save memory"
  );
}


};

return ( <View style={styles.container}>

  <View style={styles.headerCard}>
    <Text style={styles.title}>
      📝 Memory Journal
    </Text>

    <Text style={styles.subtitle}>
      Store important moments and notes
    </Text>
  </View>

  <TextInput
    style={styles.input}
    placeholder="Write a memory..."
    placeholderTextColor="#94A3B8"
    value={memoryText}
    onChangeText={setMemoryText}
    multiline
  />

  <TouchableOpacity
    style={styles.button}
    onPress={addMemory}
  >
    <Text style={styles.buttonText}>
      Save Memory
    </Text>
  </TouchableOpacity>

  <FlatList
    data={memories}
    keyExtractor={(item) =>
      item.id.toString()
    }
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={loadMemories}
      />
    }
    showsVerticalScrollIndicator={false}
    ListEmptyComponent={
      <View style={styles.emptyContainer}>

        <Text style={styles.emptyIcon}>
          📝
        </Text>

        <Text style={styles.emptyTitle}>
          No Memories Yet
        </Text>

        <Text style={styles.emptyText}>
          Save your first memory
        </Text>

      </View>
    }
    renderItem={({ item }) => (

      <View style={styles.card}>

        <Text
          style={styles.memoryText}
        >
          {item.memory_text}
        </Text>

        <Text
          style={styles.date}
        >
          {new Date(
            item.created_at
          ).toLocaleString()}
        </Text>

      </View>

    )}
  />

</View>


);
}

const styles = StyleSheet.create({

container: {
flex: 1,
backgroundColor: "#F8FAFC",
padding: 20,
},

headerCard: {
backgroundColor: "#2563EB",
borderRadius: 22,
padding: 22,
marginBottom: 20,
},

title: {
color: "#fff",
fontSize: 28,
fontWeight: "700",
},

subtitle: {
color: "#DBEAFE",
marginTop: 8,
},

input: {
backgroundColor: "#fff",
borderRadius: 18,
padding: 16,
minHeight: 120,
textAlignVertical: "top",
marginBottom: 15,


shadowColor: "#000",
shadowOffset: {
  width: 0,
  height: 2,
},
shadowOpacity: 0.05,
shadowRadius: 5,

elevation: 2,


},

button: {
backgroundColor: "#2563EB",
paddingVertical: 15,
borderRadius: 14,
marginBottom: 20,
},

buttonText: {
color: "#fff",
textAlign: "center",
fontWeight: "700",
fontSize: 16,
},

card: {
backgroundColor: "#fff",
borderRadius: 18,
padding: 18,
marginBottom: 12,

shadowColor: "#000",
shadowOffset: {
  width: 0,
  height: 3,
},
shadowOpacity: 0.05,
shadowRadius: 5,

elevation: 3,


},

memoryText: {
fontSize: 15,
color: "#0F172A",
lineHeight: 22,
},

date: {
marginTop: 12,
fontSize: 12,
color: "#64748B",
},

emptyContainer: {
alignItems: "center",
marginTop: 80,
},

emptyIcon: {
fontSize: 60,
},

emptyTitle: {
marginTop: 15,
fontSize: 18,
fontWeight: "700",
},

emptyText: {
color: "#64748B",
marginTop: 6,
},

});
