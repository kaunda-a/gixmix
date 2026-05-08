"use client";

import { useState } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Input,
  Card,
} from "@once-ui-system/core";

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

const weatherCodes: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "\u2600\uFE0F" },
  1: { label: "Mainly clear", icon: "\uD83C\uDF24\uFE0F" },
  2: { label: "Partly cloudy", icon: "\u26C5" },
  3: { label: "Overcast", icon: "\u2601\uFE0F" },
  45: { label: "Foggy", icon: "\uD83C\uDF2B\uFE0F" },
  48: { label: "Depositing rime fog", icon: "\uD83C\uDF2B\uFE0F" },
  51: { label: "Light drizzle", icon: "\uD83C\uDF26\uFE0F" },
  53: { label: "Moderate drizzle", icon: "\uD83C\uDF26\uFE0F" },
  55: { label: "Dense drizzle", icon: "\uD83C\uDF27\uFE0F" },
  56: { label: "Light freezing drizzle", icon: "\uD83C\uDF27\uFE0F" },
  57: { label: "Dense freezing drizzle", icon: "\uD83C\uDF27\uFE0F" },
  61: { label: "Slight rain", icon: "\uD83C\uDF26\uFE0F" },
  63: { label: "Moderate rain", icon: "\uD83C\uDF27\uFE0F" },
  65: { label: "Heavy rain", icon: "\uD83C\uDF27\uFE0F" },
  66: { label: "Light freezing rain", icon: "\uD83C\uDF28\uFE0F" },
  67: { label: "Heavy freezing rain", icon: "\uD83C\uDF28\uFE0F" },
  71: { label: "Slight snow", icon: "\uD83C\uDF28\uFE0F" },
  73: { label: "Moderate snow", icon: "\u2744\uFE0F" },
  75: { label: "Heavy snow", icon: "\u2744\uFE0F" },
  77: { label: "Snow grains", icon: "\u2744\uFE0F" },
  80: { label: "Slight rain showers", icon: "\uD83C\uDF26\uFE0F" },
  81: { label: "Moderate rain showers", icon: "\uD83C\uDF27\uFE0F" },
  82: { label: "Violent rain showers", icon: "\uD83C\uDF27\uFE0F" },
  85: { label: "Slight snow showers", icon: "\u2744\uFE0F" },
  86: { label: "Heavy snow showers", icon: "\u2744\uFE0F" },
  95: { label: "Thunderstorm", icon: "\u26A1" },
  96: { label: "Thunderstorm with slight hail", icon: "\u26A1" },
  99: { label: "Thunderstorm with heavy hail", icon: "\u26A1" },
};

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<{ location: string; data: WeatherData } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=5&language=en&format=json`);
      if (!geoRes.ok) throw new Error("Geocoding service unavailable");
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Try a different name.");
      }

      const loc: GeocodingResult = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
      );
      if (!weatherRes.ok) throw new Error("Weather service unavailable");
      const weatherData: WeatherData = await weatherRes.json();

      setWeather({
        location: `${loc.name}, ${loc.country}`,
        data: weatherData,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const wc = weather ? weatherCodes[weather.data.current.weather_code] || { label: "Unknown", icon: "\u2753" } : null;

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Weather App
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Get current weather for any city worldwide
      </Text>
      <Text onBackground="neutral-weak" variant="body-default-s" align="center">
        Powered by Open-Meteo (free, no API key required)
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="m">
          <Input
            id="city"
            label="City Name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Tokyo, London, New York"
          />

          <Flex fillWidth horizontal="end">
            <Button size="l" variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Loading..." : "Get Weather"}
            </Button>
          </Flex>
        </Column>
      </Card>

      {error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}

      {weather && wc && (
        <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
          <Column gap="l" horizontal="center" align="center">
            <div style={{ fontSize: "3rem", marginBottom: "0.25rem" }}>{wc.icon}</div>
            <Heading as="h2" variant="heading-strong-m">{weather.location}</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">{wc.label}</Text>

            <Heading variant="display-strong-l" style={{ fontSize: "3.5rem" }}>
              {Math.round(weather.data.current.temperature_2m)}&deg;C
            </Heading>

            <Row gap="m" fillWidth wrap={true}>
              <Flex flex={1}>
                <Column
                  fillWidth
                  padding="m"
                  radius="s"
                  border="neutral-alpha-weak"
                  horizontal="center"
                  align="center"
                  gap="4"
                >
                  <Text variant="body-default-s" onBackground="neutral-weak">Feels like</Text>
                  <Text variant="heading-strong-m">{Math.round(weather.data.current.apparent_temperature)}&deg;C</Text>
                </Column>
              </Flex>
              <Flex flex={1}>
                <Column
                  fillWidth
                  padding="m"
                  radius="s"
                  border="neutral-alpha-weak"
                  horizontal="center"
                  align="center"
                  gap="4"
                >
                  <Text variant="body-default-s" onBackground="neutral-weak">Humidity</Text>
                  <Text variant="heading-strong-m">{weather.data.current.relative_humidity_2m}%</Text>
                </Column>
              </Flex>
              <Flex flex={1}>
                <Column
                  fillWidth
                  padding="m"
                  radius="s"
                  border="neutral-alpha-weak"
                  horizontal="center"
                  align="center"
                  gap="4"
                >
                  <Text variant="body-default-s" onBackground="neutral-weak">Wind Speed</Text>
                  <Text variant="heading-strong-m">{weather.data.current.wind_speed_10m} km/h</Text>
                </Column>
              </Flex>
              <Flex flex={1}>
                <Column
                  fillWidth
                  padding="m"
                  radius="s"
                  border="neutral-alpha-weak"
                  horizontal="center"
                  align="center"
                  gap="4"
                >
                  <Text variant="body-default-s" onBackground="neutral-weak">Condition</Text>
                  <Text variant="heading-strong-m">{wc.label}</Text>
                </Column>
              </Flex>
            </Row>
          </Column>
        </Card>
      )}
    </Column>
  );
}
