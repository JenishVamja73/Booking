import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BookingDetails = ({ route, navigation }) => {
  const { selectedTime } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  console.log(selectedTime)

 

  const handleSave = async () => {
    if (!name || !phone) {
      alert("Please fill in all fields!");
      return;
    }
    const bookingDetails = { name, phone, time: selectedTime };
    try {
      await AsyncStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      alert("Booking saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving booking details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Your Details</Text>
      <Text style={styles.label}>Selected Time: {selectedTime}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BookingDetails;
