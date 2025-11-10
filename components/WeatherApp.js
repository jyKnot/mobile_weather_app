// WeatherApp.js
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function WeatherApp({ city, current, forecast = [] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Forecast</Text>

      {current && typeof current.temp === "number" ? (
        <View style={styles.card}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.date}>{new Date().toLocaleString()}</Text>
          <Text style={styles.temp}>{Math.round(current.temp)}°C</Text>
          <Text style={styles.desc}>{current.description}</Text>
          <Text style={styles.details}>
            Wind: {current.wind} m/s • Humidity: {current.humidity}%
          </Text>
        </View>
      ) : (
        <Text style={styles.info}>Enter a city to see the weather.</Text>
      )}

      {forecast.length > 0 && (
        <>
          <Text style={styles.subtitle}>Next 24 Hours</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forecastContainer}
          >
            {forecast.slice(0, 8).map((hour, i) => (
              <View key={i} style={styles.forecastItem}>
                <Text style={styles.forecastTime}>
                  {formatHour(hour.time)}
                </Text>
                <Text style={styles.forecastTemp}>
                  {Math.round(hour.temp)}°
                </Text>
                <Text style={styles.forecastCondition}>{hour.condition}</Text>
                <Text style={styles.forecastWind}>{hour.wind} m/s</Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function formatHour(timeOrIso) {
  const d = typeof timeOrIso === "number" ? new Date(timeOrIso) : new Date(timeOrIso);
  return d.toLocaleTimeString([], { hour: "numeric" });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffffdd",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#f5f9ff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  city: { fontSize: 18, fontWeight: "600" },
  date: { color: "#666", fontSize: 12 },
  temp: { fontSize: 48, fontWeight: "bold", marginVertical: 8 },
  desc: { textTransform: "capitalize", fontSize: 18 },
  details: { color: "#555", fontSize: 14, marginTop: 4 },
  info: { textAlign: "center", color: "#666", marginVertical: 8 },
  subtitle: { textAlign: "center", fontWeight: "600", marginBottom: 8 },
  forecastContainer: { paddingHorizontal: 8 },
  forecastItem: {
    backgroundColor: "#eef3ff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginRight: 10,
    width: 100,
  },
  forecastTime: { fontSize: 12, color: "#333" },
  forecastTemp: { fontSize: 24, fontWeight: "bold" },
  forecastCondition: { fontSize: 12, textTransform: "capitalize" },
  forecastWind: { fontSize: 10, color: "#666" },
});
