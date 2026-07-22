import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "../../src/services/api";

export default function MedicationsScreen() {

  const [medications, setMedications] =
    useState<any[]>([]);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [medicineName, setMedicineName] =
    useState("");

  const [dosage, setDosage] =
    useState("");

  const [time, setTime] =
    useState("");

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {

    try {

      const userData =
        await AsyncStorage.getItem("user");

      const user =
        JSON.parse(userData || "{}");

      const response =
        await API.get(
          `/medications/${user.id}`
        );

      setMedications(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const addMedication = async () => {

    try {

      if (
        !medicineName ||
        !dosage ||
        !time
      ) {
        Alert.alert(
          "Validation",
          "All fields required"
        );
        return;
      }

      const userData =
        await AsyncStorage.getItem("user");

      const user =
        JSON.parse(userData || "{}");

      await API.post(
        "/medications",
        {
          user_id: user.id,
          medicine_name: medicineName,
          dosage,
          reminder_time: time,
        }
      );

      setMedicineName("");
      setDosage("");
      setTime("");

      setModalVisible(false);

      loadMedications();

    } catch (error) {
      console.log(error);
    }
  };

  const markTaken = async (
    id: number
  ) => {

    try {

      await API.patch(
        `/medications/${id}/complete`
      );

      loadMedications();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          💊 Medications
        </Text>

        <Text style={styles.subtitle}>
          Manage daily medicines
        </Text>
      </View>

      <FlatList
        data={medications}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.medName}>
              {item.medicine_name}
            </Text>

            <Text style={styles.dosage}>
              {item.dosage}
            </Text>

            <Text style={styles.time}>
              ⏰ {item.reminder_time}
            </Text>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() =>
                markTaken(item.id)
              }
            >
              <Text
                style={styles.doneText}
              >
                Mark Taken
              </Text>
            </TouchableOpacity>

          </View>

        )}
      />

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

      <Modal
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>

          <Text style={styles.modalTitle}>
            Add Medication
          </Text>

          <TextInput
            placeholder="Medicine Name"
            style={styles.input}
            value={medicineName}
            onChangeText={
              setMedicineName
            }
          />

          <TextInput
            placeholder="Dosage"
            style={styles.input}
            value={dosage}
            onChangeText={setDosage}
          />

          <TextInput
            placeholder="08:00"
            style={styles.input}
            value={time}
            onChangeText={setTime}
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={addMedication}
          >
            <Text
              style={styles.saveText}
            >
              Save Medication
            </Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F8FAFC",
    padding:20,
  },

  header:{
    backgroundColor:"#2563EB",
    borderRadius:20,
    padding:20,
    marginBottom:20,
  },

  title:{
    color:"#fff",
    fontSize:28,
    fontWeight:"700",
  },

  subtitle:{
    color:"#DBEAFE",
    marginTop:8,
  },

  card:{
    backgroundColor:"#fff",
    borderRadius:18,
    padding:18,
    marginBottom:12,
  },

  medName:{
    fontSize:18,
    fontWeight:"700",
  },

  dosage:{
    marginTop:8,
  },

  time:{
    marginTop:8,
    color:"#64748B",
  },

  doneBtn:{
    backgroundColor:"#16A34A",
    marginTop:15,
    padding:10,
    borderRadius:12,
  },

  doneText:{
    color:"#fff",
    textAlign:"center",
    fontWeight:"700",
  },

  fab:{
    position:"absolute",
    right:25,
    bottom:30,
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:"#2563EB",
    justifyContent:"center",
    alignItems:"center",
  },

  fabText:{
    color:"#fff",
    fontSize:30,
  },

  modalContainer:{
    flex:1,
    justifyContent:"center",
    padding:20,
  },

  modalTitle:{
    fontSize:26,
    fontWeight:"700",
    marginBottom:20,
  },

  input:{
    backgroundColor:"#fff",
    padding:15,
    borderRadius:15,
    marginBottom:15,
  },

  saveBtn:{
    backgroundColor:"#2563EB",
    padding:15,
    borderRadius:15,
  },

  saveText:{
    color:"#fff",
    textAlign:"center",
    fontWeight:"700",
  },

});