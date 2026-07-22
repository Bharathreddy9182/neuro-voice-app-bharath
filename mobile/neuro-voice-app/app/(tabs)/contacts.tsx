import React, {
  useEffect,
  useState
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../../src/services/api";

export default function ContactsScreen() {

  const [contacts, setContacts] =
    useState([]);

  const [visible, setVisible] =
    useState(false);

  const [name, setName] =
    useState("");

  const [relationship, setRelationship] =
    useState("");

  const [phone, setPhone] =
    useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {

    const userData =
      await AsyncStorage.getItem("user");

    const user =
      JSON.parse(userData || "{}");

    const response =
      await API.get(
        `/contacts/${user.id}`
      );

    setContacts(response.data);
  };

  const saveContact = async () => {

    const userData =
      await AsyncStorage.getItem("user");

    const user =
      JSON.parse(userData || "{}");

    await API.post("/contacts", {
      user_id: user.id,
      contact_name: name,
      relationship,
      phone,
    });

    setVisible(false);

    setName("");
    setRelationship("");
    setPhone("");

    loadContacts();
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          ☎ Emergency Contacts
        </Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item:any)=>
          item.id.toString()
        }
        renderItem={({item}:any)=>(
          <View style={styles.card}>

            <Text style={styles.name}>
              {item.contact_name}
            </Text>

            <Text>
              {item.relationship}
            </Text>

            <Text>
              {item.phone}
            </Text>

          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          setVisible(true)
        }
      >
        <Text style={styles.plus}>
          +
        </Text>
      </TouchableOpacity>

      <Modal visible={visible}>

        <View style={styles.modal}>

          <TextInput
            placeholder="Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Relationship"
            style={styles.input}
            value={relationship}
            onChangeText={setRelationship}
          />

          <TextInput
            placeholder="Phone"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={saveContact}
          >
            <Text
              style={styles.saveText}
            >
              Save Contact
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
    padding:20
  },

  header:{
    backgroundColor:"#2563EB",
    padding:20,
    borderRadius:20,
    marginBottom:20
  },

  title:{
    color:"#fff",
    fontSize:24,
    fontWeight:"700"
  },

  card:{
    backgroundColor:"#fff",
    padding:16,
    borderRadius:16,
    marginBottom:10
  },

  name:{
    fontWeight:"700",
    fontSize:18
  },

  fab:{
    position:"absolute",
    right:20,
    bottom:30,
    backgroundColor:"#2563EB",
    width:60,
    height:60,
    borderRadius:30,
    justifyContent:"center",
    alignItems:"center"
  },

  plus:{
    color:"#fff",
    fontSize:30
  },

  modal:{
    flex:1,
    justifyContent:"center",
    padding:20
  },

  input:{
    backgroundColor:"#fff",
    padding:15,
    borderRadius:12,
    marginBottom:10
  },

  saveBtn:{
    backgroundColor:"#2563EB",
    padding:15,
    borderRadius:12
  },

  saveText:{
    color:"#fff",
    textAlign:"center",
    fontWeight:"700"
  }
});