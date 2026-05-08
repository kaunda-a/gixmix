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

interface AgeData {
  count: number;
  name: string;
  age: number | null;
}

interface GenderData {
  count: number;
  name: string;
  gender: string | null;
  probability: number;
}

interface NationalityData {
  count: number;
  name: string;
  country: { country_id: string; probability: number }[];
}

export default function NamePredictorPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [age, setAge] = useState<AgeData | null>(null);
  const [gender, setGender] = useState<GenderData | null>(null);
  const [nationality, setNationality] = useState<NationalityData | null>(null);

  const handlePredict = async () => {
    if (!name.trim()) {
      setError("Enter a name");
      return;
    }

    setLoading(true);
    setError(null);
    setAge(null);
    setGender(null);
    setNationality(null);

    try {
      const n = name.trim().toLowerCase();

      const [ageRes, genderRes, natRes] = await Promise.all([
        fetch(`https://api.agify.io/?name=${encodeURIComponent(n)}`),
        fetch(`https://api.genderize.io/?name=${encodeURIComponent(n)}`),
        fetch(`https://api.nationalize.io/?name=${encodeURIComponent(n)}`),
      ]);

      if (!ageRes.ok || !genderRes.ok || !natRes.ok)
        throw new Error("Prediction service unavailable");

      const [ageData, genderData, natData] = await Promise.all([
        ageRes.json(),
        genderRes.json(),
        natRes.json(),
      ]);

      setAge(ageData);
      setGender(genderData);
      setNationality(natData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to predict");
    } finally {
      setLoading(false);
    }
  };

  const flagEmoji = (countryCode: string) => {
    if (!countryCode) return "";
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65);
    return String.fromCodePoint(...codePoints);
  };

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Name Predictor
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Predict age, gender, and nationality from a first name
      </Text>
      <Text onBackground="neutral-weak" variant="body-default-s" align="center">
        Powered by Agify, Genderize & Nationalize (free, no API key)
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="m">
          <Input
            id="name"
            label="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex, Jordan, Taylor"
          />

          <Flex fillWidth horizontal="end">
            <Button size="l" variant="primary" onClick={handlePredict} disabled={loading}>
              {loading ? "Predicting..." : "Predict"}
            </Button>
          </Flex>
        </Column>
      </Card>

      {error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}

      {age && gender && nationality && (
        <Row gap="m" wrap={true} fillWidth>
          <Flex flex={1}>
            <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
              <Column gap="s" horizontal="center" align="center">
                <Text variant="body-default-s" onBackground="neutral-weak">Predicted Age</Text>
                <Heading variant="display-strong-m">
                  {age.age !== null ? age.age : "?"}
                </Heading>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  based on {age.count.toLocaleString()} people
                </Text>
              </Column>
            </Card>
          </Flex>
          <Flex flex={1}>
            <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
              <Column gap="s" horizontal="center" align="center">
                <Text variant="body-default-s" onBackground="neutral-weak">Predicted Gender</Text>
                <Heading variant="display-strong-m">
                  {gender.gender ? gender.gender.charAt(0).toUpperCase() + gender.gender.slice(1) : "?"}
                </Heading>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {(gender.probability * 100).toFixed(0)}% confidence
                </Text>
              </Column>
            </Card>
          </Flex>
          <Flex flex={1}>
            <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
              <Column gap="s" horizontal="center" align="center">
                <Text variant="body-default-s" onBackground="neutral-weak">Likely Nationality</Text>
                <Column gap="2" horizontal="center">
                  {nationality.country.slice(0, 3).map((c) => (
                    <Row key={c.country_id} gap="4" vertical="center">
                      <Text variant="display-strong-xs">{flagEmoji(c.country_id)}</Text>
                      <Text variant="heading-strong-xs">
                        {c.country_id} ({(c.probability * 100).toFixed(0)}%)
                      </Text>
                    </Row>
                  ))}
                  {nationality.country.length === 0 && <Text variant="heading-strong-m">?</Text>}
                </Column>
              </Column>
            </Card>
          </Flex>
        </Row>
      )}
    </Column>
  );
}
