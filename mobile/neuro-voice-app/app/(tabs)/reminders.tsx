import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";

export default function RemindersScreen() {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [reminderDate, setReminderDate] = useState("");
const [reminderTime, setReminderTime] = useState("");
const [priority, setPriority] = useState("medium");

const [modalVisible, setModalVisible] =
  useState(false);

const [reminders, setReminders] =
  useState<any[]>([]);

const [refreshing, setRefreshing] =
  useState(false);
  const pendingCount = reminders.filter(
  (item) => item.status === "pending"
).length;

const completedCount = reminders.filter(
  (item) => item.status === "completed"
).length;

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setRefreshing(true);

      const userData = await AsyncStorage.getItem("user");

      if (!userData) return;

      const user = JSON.parse(userData);

      const response = await API.get(
        `/reminders/${user.id}`
      );

      setReminders(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

const addReminder = async () => {
  try {
    if (!title.trim()) {
      Alert.alert(
        "Validation",
        "Title is required"
      );
      return;
    }

    const userData =
      await AsyncStorage.getItem("user");

    const user = JSON.parse(
      userData || "{}"
    );

    await API.post("/reminders", {
      user_id: user.id,
      title,
      description,
      reminder_date: reminderDate,
      reminder_time: reminderTime,
      priority,
    });

    Alert.alert(
      "Success",
      "Reminder Added"
    );

    setTitle("");
    setDescription("");
    setReminderDate("");
    setReminderTime("");
    setPriority("medium");

    setModalVisible(false);

    loadReminders();
  } catch (error) {
    console.log(error);
  }
};

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

return (
  <View style={styles.container}>

    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.heading}>
        📅 My Reminders
      </Text>

      <Text style={styles.subHeading}>
        Never miss important tasks
      </Text>
    </View>

    {/* Dashboard */}
    <View style={styles.statsContainer}>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>
          {reminders.length}
        </Text>
        <Text style={styles.statLabel}>
          Total
        </Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>
          {pendingCount}
        </Text>
        <Text style={styles.statLabel}>
          Pending
        </Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>
          {completedCount}
        </Text>
        <Text style={styles.statLabel}>
          Completed
        </Text>
      </View>

    </View>

    {/* Reminder List */}
    <FlatList
      data={reminders}
      keyExtractor={(item) =>
        item.id.toString()
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={loadReminders}
        />
      }
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>
            📅
          </Text>

          <Text style={styles.emptyTitle}>
            No Reminders Yet
          </Text>

          <Text style={styles.emptyText}>
            Add your first reminder
          </Text>
        </View>
      }
      renderItem={({ item }) => (

        <View style={styles.card}>

          <View style={styles.cardHeader}>

            <Text style={styles.cardTitle}>
              {item.title}
            </Text>

            <View
              style={[
                styles.priorityBadge,

                item.priority === "high"
                  ? styles.highBadge
                  : item.priority === "medium"
                  ? styles.mediumBadge
                  : styles.lowBadge,
              ]}
            >
              <Text>
                {item.priority}
              </Text>
            </View>

          </View>

          <Text style={styles.description}>
            {item.description}
          </Text>

          <Text style={styles.date}>
            📅 {item.reminder_date}
          </Text>

          <Text style={styles.time}>
            ⏰ {item.reminder_time}
          </Text>

          <View
            style={[
              styles.statusBadge,

              item.status === "completed"
                ? styles.completedBadge
                : styles.pendingBadge,
            ]}
          >
            <Text>
              {item.status}
            </Text>
          </View>

        </View>

      )}
    />

    {/* FAB */}
    <TouchableOpacity
      style={styles.fab}
      onPress={() =>
        setModalVisible(true)
      }
    >
      <Text style={styles.fabText}>
        +
      </Text>
    </TouchableOpacity>

    {/* Modal */}
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text style={styles.modalTitle}>
            Add Reminder
          </Text>

          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <TextInput
            placeholder="2026-06-10"
            value={reminderDate}
            onChangeText={setReminderDate}
            style={styles.input}
          />

          <TextInput
            placeholder="08:30"
            value={reminderTime}
            onChangeText={setReminderTime}
            style={styles.input}
          />

          <TextInput
            placeholder="high / medium / low"
            value={priority}
            onChangeText={setPriority}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={addReminder}
          >
            <Text style={styles.saveText}>
              Save Reminder
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setModalVisible(false)
            }
          >
            <Text
              style={{
                textAlign: "center",
                marginTop: 15,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>

  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },

  subHeading: {
    color: "#64748B",
    marginTop: 5,
    fontSize: 14,
  },

  statsCard: {
    backgroundColor: "#2563EB",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
  },

  statsNumber: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  statsLabel: {
    color: "#DBEAFE",
    marginTop: 5,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
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
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  reminderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },

  cardDate: {
    marginTop: 10,
    color: "#64748B",
    fontSize: 13,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },

  completedBadge: {
    backgroundColor: "#DCFCE7",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyIcon: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    color: "#64748B",
    marginTop: 5,
  },
  statsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 20,
},

statCard: {
  flex: 1,
  backgroundColor: "#fff",
  padding: 15,
  borderRadius: 16,
  marginHorizontal: 4,
  alignItems: "center",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.05,
  shadowRadius: 4,

  elevation: 3,
},

statNumber: {
  fontSize: 22,
  fontWeight: "700",
  color: "#0F172A",
},

statLabel: {
  color: "#64748B",
  marginTop: 4,
},

card: {
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 18,
  marginBottom: 15,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.08,
  shadowRadius: 5,

  elevation: 4,
},

description: {
  marginTop: 10,
  color: "#64748B",
  fontSize: 14,
  lineHeight: 20,
},

date: {
  marginTop: 12,
  fontSize: 14,
  color: "#334155",
},

time: {
  marginTop: 6,
  fontSize: 14,
  color: "#334155",
},

priorityBadge: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},

highBadge: {
  backgroundColor: "#FEE2E2",
},

mediumBadge: {
  backgroundColor: "#FEF3C7",
},

lowBadge: {
  backgroundColor: "#DCFCE7",
},

fab: {
  position: "absolute",
  bottom: 25,
  right: 25,

  width: 60,
  height: 60,

  borderRadius: 30,

  backgroundColor: "#2563EB",

  justifyContent: "center",
  alignItems: "center",

  elevation: 8,
},

fabText: {
  color: "#fff",
  fontSize: 28,
  fontWeight: "bold",
},

modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
},

modalContent: {
  backgroundColor: "#fff",
  margin: 20,
  borderRadius: 20,
  padding: 20,
},

modalTitle: {
  fontSize: 22,
  fontWeight: "700",
  marginBottom: 15,
},

saveButton: {
  backgroundColor: "#2563EB",
  paddingVertical: 14,
  borderRadius: 12,
  marginTop: 10,
},

saveText: {
  color: "#fff",
  textAlign: "center",
  fontWeight: "700",
},
// statsContainer:{
//   flexDirection:"row",
//   justifyContent:"space-between",
//   marginBottom:20,
// },

// statCard:{
//   flex:1,
//   backgroundColor:"#fff",
//   padding:15,
//   borderRadius:15,
//   marginHorizontal:4,
//   alignItems:"center",
// },

// statNumber:{
//   fontSize:24,
//   fontWeight:"bold",
// },

// statLabel:{
//   color:"#64748B",
// },

// card:{
//   backgroundColor:"#fff",
//   borderRadius:18,
//   padding:18,
//   marginBottom:15,
//   elevation:4,
// },

// cardTitle:{
//   fontSize:18,
//   fontWeight:"700",
// },

// description:{
//   color:"#64748B",
//   marginTop:10,
// },

// date:{
//   marginTop:12,
// },

// time:{
//   marginTop:6,
// },

// priorityBadge:{
//   paddingHorizontal:10,
//   paddingVertical:5,
//   borderRadius:20,
// },

// highBadge:{
//   backgroundColor:"#FEE2E2",
// },

// mediumBadge:{
//   backgroundColor:"#FEF3C7",
// },

// lowBadge:{
//   backgroundColor:"#DCFCE7",
// },

// fab:{
//   position:"absolute",
//   right:25,
//   bottom:25,

//   width:60,
//   height:60,

//   borderRadius:30,

//   backgroundColor:"#2563EB",

//   justifyContent:"center",
//   alignItems:"center",
// },

// fabText:{
//   color:"#fff",
//   fontSize:30,
//   fontWeight:"bold",
// },

// modalOverlay:{
//   flex:1,
//   backgroundColor:"rgba(0,0,0,0.4)",
//   justifyContent:"center",
// },

// modalContent:{
//   backgroundColor:"#fff",
//   margin:20,
//   borderRadius:20,
//   padding:20,
// },

// modalTitle:{
//   fontSize:22,
//   fontWeight:"700",
//   marginBottom:15,
// },
});