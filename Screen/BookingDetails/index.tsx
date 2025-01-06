import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const BookingDetails = ({ route, navigation }) => {
  const { selectedTime, name: initialName, phone: initialPhone, isEditing } = route.params;
 
  const [name, setName] = useState(initialName || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [bookings, setBookings] = useState([]); // State to hold current bookings

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const existingData = await AsyncStorage.getItem("bookingDetails");
        let storedBookings = [];
        if (existingData) {
          try {
            storedBookings = JSON.parse(existingData);
            if (!Array.isArray(storedBookings)) {
              throw new Error("Invalid data format");
            }
          } catch (error) {
            console.error("Error parsing stored data:", error);
            storedBookings = [];
          }
        }
        setBookings(storedBookings);
        console.log(storedBookings,"stroedBooking")
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleSave = async () => {
    if (!name || !phone) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    const updatedBooking = { name, phone, time: selectedTime || new Date().toISOString() };

    try {
      let updatedBookings;

      if (isEditing) {
        updatedBookings = bookings.map((booking) =>
          booking.time === selectedTime ? updatedBooking : booking
        );
      } else {
        updatedBookings = [...bookings, updatedBooking];
      }

      await AsyncStorage.setItem("bookingDetails", JSON.stringify(updatedBookings));

      setBookings(updatedBookings);
      console.log(setBookings(updatedBooking),"udd")

      Alert.alert("Success", isEditing ? "Booking updated successfully!" : "Booking saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving booking details:", error);
      Alert.alert("Error", "An error occurred while saving the booking.");
    }
  };

  
  

  const handleDelete = async (time) => {
    try {
      const updatedBookings = bookings.filter((booking) => booking.time !== time);
      await AsyncStorage.setItem("bookingDetails", JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
      Alert.alert("Success", "Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      Alert.alert("Error", "An error occurred while deleting the booking.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isEditing ? "Edit Booking" : "New Booking"}</Text>
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
        <Text style={styles.saveText}>{isEditing ? "Update Booking" : "Save Booking"}</Text>
      </TouchableOpacity>

      <View style={styles.bookingsContainer}>
        <Text style={styles.bookingListHeader}>Bookings:</Text>
        {bookings.map((booking, index) => (
          <View key={index} style={styles.bookingItem}>
            <Text>
              {booking.name} ({booking.phone}) - {booking.time}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(booking.time)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
  bookingsContainer: {
    marginTop: 20,
  },
  bookingListHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookingItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 4,
  },
  deleteText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default BookingDetails;
