import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import  { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";
import { router } from "expo-router";
export default function HomeScreen() {
const [reminders, setReminders] = useState<any[]>([]);
  const [userName, setUserName] =
    useState("User");
const [dashboard, setDashboard] =
  useState<any>(null);
useEffect(() => {
  loadUser();
  loadDashboard();
}, []);
const pendingCount =
  reminders.filter(
    (r) => r.status === "pending"
  ).length;
  const loadUser = async () => {
    const userData =
      await AsyncStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name);
    }
  };
  const loadReminders = async () => {
  try {
    const userData =
      await AsyncStorage.getItem("user");

    if (!userData) return;

    const user = JSON.parse(userData);

    const response =
      await API.get(
        `/reminders/${user.id}`
      );

    setReminders(response.data);
  } catch (error) {
    console.log(error);
  }
};
const loadDashboard = async () => {
  try {

    const userData =
      await AsyncStorage.getItem("user");

    if (!userData) return;

    const user = JSON.parse(userData);

    const response =
      await API.get(
        `/dashboard/${user.id}`
      );

    setDashboard(response.data);

  } catch (error) {
    console.log(error);
  }
};
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

<View style={styles.headerCard}>
  <Text style={styles.greeting}>
    Good Morning 👋
  </Text>

  <Text style={styles.userName}>
    {userName}
  </Text>

  <Text style={styles.subtitle}>
    Stay organized and never miss a task
  </Text>
</View>

<View style={styles.statsContainer}>
  <View style={styles.statCard}>
    <Text>{dashboard?.total_reminders || 0}</Text>
    <Text>Total</Text>
  </View>

  <View style={styles.statCard}>
    <Text>{dashboard?.pending_reminders || 0}</Text>
    <Text>Pending</Text>
  </View>
</View>

<View style={styles.statsContainer}>
  <View style={styles.statCard}>
    <Text>{dashboard?.completed_reminders || 0}</Text>
    <Text>Completed</Text>
  </View>
</View>

<View style={styles.statsContainer}>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      {dashboard?.total_medications || 0}
    </Text>

    <Text style={styles.statLabel}>
      💊 Medicines
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      {dashboard?.pending_medications || 0}
    </Text>

    <Text style={styles.statLabel}>
      ⏰ Pending Meds
    </Text>
  </View>

</View>
<View style={styles.aiCard}>
  <Text style={styles.aiTitle}>
    🧠 Memory Health
  </Text>

  <Text style={styles.aiText}>
    Score:
    {dashboard?.memory_health_score || 0}%
  </Text>
</View>

<View style={styles.aiCard}>
  <Text style={styles.aiTitle}>
    🎤 AI Assistant
  </Text>

  <Text style={styles.aiText}>
    Ask reminders, memories and questions
  </Text>

  <TouchableOpacity
    style={styles.aiButton}
    onPress={() => router.push("/voice" as any)}
    >
    <Text style={styles.aiButtonText}>
      Start Talking
    </Text>
  </TouchableOpacity>
</View>

<Text style={styles.sectionTitle}>
  Today's Reminders
</Text>

{dashboard?.today_reminders?.length > 0 ? (

  dashboard.today_reminders.map(
    (item: any) => (

      <View
        key={item.id}
        style={styles.reminderCard}
      >

        <View>
          <Text style={styles.cardTitle}>
            {item.title}
          </Text>

          <Text style={styles.cardTime}>
            {item.reminder_time}
          </Text>
        </View>

        <View style={styles.pendingBadge}>
          <Text>
            {item.status}
          </Text>
        </View>

      </View>
    )
  )

) : (

  <View style={styles.emptyCard}>
    <Text>
      No reminders today 🎉
    </Text>
  </View>

)}
{/* 
<Text style={styles.sectionTitle}>
  Quick Actions
</Text>

<View style={styles.quickGrid}>

  <TouchableOpacity
    style={styles.quickCard}
  >
    <Text style={styles.quickIcon}>
      📅
    </Text>

    <Text style={styles.quickText}>
      Reminders
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.quickCard}
  >
    <Text style={styles.quickIcon}>
      📝
    </Text>

    <Text style={styles.quickText}>
      Memories
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.quickCard}
  >
    <Text style={styles.quickIcon}>
      ☎️
    </Text>

    <Text style={styles.quickText}>
      Contacts
    </Text>
  </TouchableOpacity>

</View> */}

      {/* Recent Memory */}

      <Text style={styles.sectionTitle}>
        Recent Memory
      </Text>

      <View style={styles.memoryCard}>
        <Text style={styles.memoryText}>
            {dashboard?.recent_memory}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
  },

headerCard: {
  borderRadius: 25,
  padding: 25,
  marginTop: 15,

  backgroundColor: "#2563EB",
},

  greeting: {
    color: "#fff",
    fontSize: 18,
  },

  userName: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
  },

  subtitle: {
    color: "#DCE8FF",
    marginTop: 10,
  },

  voiceSection: {
    alignItems: "center",
    marginTop: 35,
  },

  voiceButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  voiceIcon: {
    fontSize: 70,
  },

  voiceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },

  voiceSubtitle: {
    color: "#64748B",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 35,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  cardTime: {
    marginTop: 8,
    color: "#64748B",
  },

  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionCard: {
    backgroundColor: "#fff",
    width: "31%",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    elevation: 2,
  },

  actionIcon: {
    fontSize: 30,
  },

  actionText: {
    marginTop: 10,
    fontWeight: "600",
  },

  memoryCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 30,
  },

  memoryText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#334155",
  },
  statsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},

statCard: {
  flex: 1,
  backgroundColor: "#fff",
  padding: 16,
  borderRadius: 18,
  alignItems: "center",
  marginHorizontal: 4,
},

statNumber: {
  fontSize: 24,
  fontWeight: "700",
},

statLabel: {
  color: "#64748B",
  marginTop: 5,
},
  statsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 20,
},
statEmoji: {
  fontSize: 22,
  marginBottom: 8,
},

aiCard: {
  backgroundColor: "#2563EB",
  borderRadius: 22,
  padding: 22,
  marginTop: 10,
},

aiTitle: {
  color: "#fff",
  fontSize: 22,
  fontWeight: "700",
},

aiText: {
  color: "#DBEAFE",
  marginTop: 10,
},

aiButton: {
  backgroundColor: "#fff",
  marginTop: 18,
  paddingVertical: 12,
  borderRadius: 12,
},

aiButtonText: {
  textAlign: "center",
  fontWeight: "700",
  color: "#2563EB",
},

reminderCard: {
  backgroundColor: "#fff",
  padding: 18,
  borderRadius: 18,
  marginBottom: 12,

  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

pendingBadge: {
  backgroundColor: "#FEF3C7",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},

emptyCard: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 18,
  alignItems: "center",
},

quickGrid: {
  flexDirection: "row",
  justifyContent: "space-between",
},

quickCard: {
  width: "31%",
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 18,
  alignItems: "center",
},

quickIcon: {
  fontSize: 28,
},

quickText: {
  marginTop: 10,
  fontWeight: "600",
},
});