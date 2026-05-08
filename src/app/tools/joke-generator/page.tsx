"use client";

import { useState } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Card,
  Select,
} from "@once-ui-system/core";

interface JokeResponse {
  error: boolean;
  category: string;
  type: "single" | "twopart";
  joke?: string;
  setup?: string;
  delivery?: string;
  flags: { [key: string]: boolean };
  safe: boolean;
  id: number;
  lang: string;
}

export default function JokeGeneratorPage() {
  const [category, setCategory] = useState("Any");
  const [joke, setJoke] = useState<JokeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: "Any", label: "Any" },
    { value: "Programming", label: "Programming" },
    { value: "Misc", label: "Miscellaneous" },
    { value: "Dark", label: "Dark" },
    { value: "Pun", label: "Pun" },
    { value: "Spooky", label: "Spooky" },
    { value: "Christmas", label: "Christmas" },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setJoke(null);

    try {
      const catParam = category === "Any" ? "" : `&category=${category}`;
      const res = await fetch(
        `https://v2.jokeapi.dev/joke/${category}?safe-mode${catParam}`
      );
      if (!res.ok) throw new Error("Joke service unavailable");
      const data: JokeResponse = await res.json();
      if (data.error) throw new Error("Could not fetch joke");
      setJoke(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch joke");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Joke Generator
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Get a random joke to brighten your day
      </Text>
      <Text onBackground="neutral-weak" variant="body-default-s" align="center">
        Powered by JokeAPI (free, no API key required)
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="m">
          <Select
            id="category"
            label="Category"
            options={categories}
            value={category}
            onSelect={(v) => setCategory(v as string)}
          />

          <Flex fillWidth horizontal="end">
            <Button size="l" variant="primary" onClick={handleGenerate} disabled={loading}>
              {loading ? "Loading..." : "Generate Joke"}
            </Button>
          </Flex>
        </Column>
      </Card>

      {error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}

      {joke && (
        <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
          <Column gap="m" horizontal="center" align="center">
            <Row gap="8" vertical="center">
              <Text variant="body-default-s" onBackground="brand-weak">
                {joke.category}
              </Text>
              {joke.flags.nsfw && (
                <Text variant="body-default-s" onBackground="danger-weak">NSFW</Text>
              )}
              {joke.flags.racist && (
                <Text variant="body-default-s" onBackground="danger-weak">Racist</Text>
              )}
              {joke.flags.sexist && (
                <Text variant="body-default-s" onBackground="danger-weak">Sexist</Text>
              )}
            </Row>

            {joke.type === "single" ? (
              <Text variant="heading-strong-m" align="center">
                {joke.joke}
              </Text>
            ) : (
              <Column gap="s" horizontal="center" align="center">
                <Text variant="heading-strong-m" align="center">
                  {joke.setup}
                </Text>
                <Text variant="heading-strong-s" onBackground="brand-weak" align="center">
                  {joke.delivery}
                </Text>
              </Column>
            )}

            <Button size="m" variant="secondary" onClick={handleGenerate} disabled={loading}>
              Another One
            </Button>
          </Column>
        </Card>
      )}
    </Column>
  );
}
