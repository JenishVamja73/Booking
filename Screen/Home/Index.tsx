import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const Home = ({ navigation }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [savedBooking, setSavedBooking] = useState([]);
    c

    const slots = [
        { id: 1, time: "09:00 AM" },
        { id: 2, time: "11:30 AM" },
        { id: 3, time: "02:00 PM" },
        { id: 4, time: "04:30 PM" },
        { id: 5, time: "07:00 PM" },
        { id: 6, time: "09:30 PM" },
    ];

    // Handle slot selection and navigate to the booking details screen
    const handleSlotSelection = (slotId, slotTime) => {
        // Check if the slot is already booked
        if (savedBooking.some((booking) => booking.time === slotTime)) {
            Alert.alert("This slot is already booked!");
            return;
        }

        // Proceed with the booking if the slot is not already booked
        setSelectedSlot(slotId);
        navigation.navigate("BookingDetails", { selectedTime: slotTime });
    };

    // Fetch saved booking details from AsyncStorage
    const fetchBookingDetails = async () => {
        try {
            const bookingData = await AsyncStorage.getItem('bookingDetails');
            if (bookingData) {
                const parsedBookingData = JSON.parse(bookingData);
                // Ensure savedBooking is an array
                setSavedBooking(Array.isArray(parsedBookingData) ? parsedBookingData : [parsedBookingData]);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    // Fetch booking details when the component mounts or when returning from BookingDetails
    useEffect(() => {
        fetchBookingDetails();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.bookingItem} onPress={EditUpdate}>
            <Text style={styles.bookingText}>Name: {item.name}</Text>
            <Text style={styles.bookingText}>Phone: {item.phone}</Text>
            <Text style={styles.bookingText}>Time: {item.time}</Text>
        </TouchableOpacity>
    );
    const EditUpdate = (item) => {
        navigation.navigate("BookingDetails", {
          name: item.name,
          phone: item.phone,
          time: item.time,
        });
        console.log(item,"item")
      };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select a Show Time</Text>
            <View style={styles.slotContainer}>
                {slots.map((slot) => (
                    <TouchableOpacity
                        key={slot.id}
                        style={[
                            styles.slot,
                            savedBooking.some((booking) => booking.time === slot.time) && styles.bookedSlot, // Highlight booked slots
                            selectedSlot === slot.id && styles.selectedSlot,
                        ]}
                        onPress={() => handleSlotSelection(slot.id, slot.time)}
                    >
                        <Text
                            style={[
                                styles.slotText,
                                savedBooking.some((booking) => booking.time === slot.time) && styles.bookedSlotText, // Change text color for booked slots
                                selectedSlot === slot.id && styles.selectedSlotText,
                            ]}
                        >
                            {savedBooking.some((booking) => booking.time === slot.time) ? "Booked" : slot.time}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {savedBooking.length  ? (
          <FlatList
            data={savedBooking}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.noBookingsText}>No bookings found.</Text>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    slotContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    slot: {
        backgroundColor: "#e0e0e0",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        width: "48%", // Adjust the width to fit two slots per row
        alignItems: "center",
    },
    selectedSlot: {
        backgroundColor: "#4caf50",
    },
    slotText: {
        fontSize: 16,
        color: "#333",
    },
    selectedSlotText: {
        color: "#fff",
        fontWeight: "bold",
    },
    bookingItem: {
        backgroundColor: '#e8f5e9',
        padding: 16,
        marginBottom: 10,
        borderRadius: 8,
    },

    noBookingsText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#757575',
    },
    bookedSlot: {
        backgroundColor: "#e0e0e0", // Gray background for booked slots
    },
    bookedSlotText: {
        color: "#757575", // Dimmed text color for booked slots
        fontStyle: "italic",
    },
});

export default Home;
