import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  // SafeAreaView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import useFetchWeather from './hooks/useFetchWeather';
import SearchBar from './components/SearchBar';
import WeatherApp from './components/WeatherApp';

export default function App() {
  const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  const [place, setPlace] = useState(null);

  const url = useMemo(() => {
    if (!place) return null;
    const base = 'https://api.openweathermap.org/data/2.5/forecast';
    const params = new URLSearchParams({
      lat: String(place.lat),
      lon: String(place.lon),
      appid: API_KEY,
      units: 'metric',
    });
    return `${base}?${params.toString()}`;
  }, [place, API_KEY]);

  const { data, loading, error } = useFetchWeather(url);

  // choose layout based on whether a city is selected
  const isFrontPage = !place && !loading && !error;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isFrontPage ? styles.centered : styles.topAligned, 
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* --- Search Bar --- */}
          <SearchBar onPlaceSelect={setPlace} />

          {/* --- Selected Place --- */}
          {place && (
            <Text style={styles.info}>
              Selected: {place.name}
              {place.state ? `, ${place.state}` : ''}
              {place.country ? `, ${place.country}` : ''} (
              {place.lat.toFixed(2)}, {place.lon.toFixed(2)})
            </Text>
          )}

          {/* --- App Title --- */}
          <Text style={styles.heading}>Weather App</Text>

          {/* --- Info / Loading / Error Messages --- */}
          {!place && !loading && (
            <Text style={styles.info}>
              Search and select a city to see the forecast.
            </Text>
          )}
          {place && loading && <ActivityIndicator size="large" color="#fff" />}
          {place && error && <Text style={styles.error}>Error: {error}</Text>}

          {/* --- Weather Results --- */}
          {place && data && (
            <WeatherApp
              city={`${data.city?.name}, ${data.city?.country}`}
              current={{
                temp: data.list[0].main.temp,
                wind: data.list[0].wind.speed,
                humidity: data.list[0].main.humidity,
                description: data.list[0].weather[0].description,
              }}
              forecast={data.list.map((item) => ({
                time: item.dt_txt,
                temp: item.main.temp,
                condition: item.weather[0].main,
                wind: item.wind.speed,
              }))}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#242424',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  centered: {
    justifyContent: 'center', // center for front page
    alignItems: 'center',
  },
  topAligned: {
    justifyContent: 'flex-start', // top for weather screen
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignItems: 'center',
  },
  heading: {
    color: 'white',
    fontSize: 32,
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: 'bold',
  },
  info: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },
});
