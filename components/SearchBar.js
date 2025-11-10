// SearchBar.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons"; // icon library included with Expo

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

export default function SearchBar({ onPlaceSelect }) {
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=1&appid=${API_KEY}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const place = data[0];
        onPlaceSelect?.({
          name: place.name,
          country: place.country,
          lat: place.lat,
          lon: place.lon,
        });
      } else {
        Alert.alert("Not found", "City not found");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error fetching city");
    }
  };

  const handleUseMyLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required");
        setLocating(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
      );
      const data = await res.json();
      const first = data[0];
      const place = {
        name: first?.name || "My location",
        country: first?.country,
        lat: latitude,
        lon: longitude,
      };
      onPlaceSelect?.(place);
      setQuery(`${place.name}${place.country ? ", " + place.country : ""}`);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Couldn't determine your city");
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search city"
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleUseMyLocation}
        disabled={locating}
      >
        {locating ? (
          <ActivityIndicator color="#90caf9" />
        ) : (
          <Ionicons name="location-outline" size={22} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    minWidth: 250,
    padding: 10,
    borderWidth: 1,
    borderColor: "#90caf9",
    borderRadius: 8,
    color: "#fff",
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#90caf9",
    borderRadius: 8,
    marginLeft: 8,
  },
});
