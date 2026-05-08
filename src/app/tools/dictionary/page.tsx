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

interface DictionaryEntry {
  word: string;
  phonetic: string;
  phonetics: { text: string; audio: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example: string; synonyms: string[] }[];
  }[];
}

export default function DictionaryPage() {
  const [word, setWord] = useState("");
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!word.trim()) {
      setError("Enter a word");
      return;
    }

    setLoading(true);
    setError(null);
    setEntry(null);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim().toLowerCase())}`
      );
      if (!res.ok) throw new Error("Word not found — check the spelling");
      const data: DictionaryEntry[] = await res.json();
      if (!data || data.length === 0) throw new Error("Word not found");
      setEntry(data[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch definition");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (!entry) return;
    const audioSrc = entry.phonetics.find((p) => p.audio)?.audio;
    if (audioSrc) {
      new Audio(audioSrc).play();
    }
  };

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Dictionary Lookup
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Find definitions, phonetics, and examples for any English word
      </Text>
      <Text onBackground="neutral-weak" variant="body-default-s" align="center">
        Powered by Free Dictionary API (no API key required)
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="m">
          <Input
            id="word"
            label="Word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="e.g. serendipity, ephemeral, paradigm"
          />

          <Flex fillWidth horizontal="end">
            <Button size="l" variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Define"}
            </Button>
          </Flex>
        </Column>
      </Card>

      {error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}

      {entry && (
        <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
          <Column gap="l">
            <Row gap="m" vertical="center">
              <Column gap="4">
                <Heading as="h2" variant="heading-strong-l">
                  {entry.word}
                </Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  {entry.phonetic || entry.phonetics.find((p) => p.text)?.text || ""}
                </Text>
              </Column>
              {entry.phonetics.some((p) => p.audio) && (
                <Button size="m" variant="secondary" onClick={handlePlayAudio}>
                  Play Audio
                </Button>
              )}
            </Row>

            {entry.meanings.map((m, i) => (
              <Column key={i} gap="s">
                <Row gap="8" vertical="center">
                  <Text
                    variant="body-default-s"
                    style={{
                      background: "var(--brand-background-weak)",
                      padding: "0.1rem 0.6rem",
                      borderRadius: "var(--radius-s)",
                      textTransform: "capitalize",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    {m.partOfSpeech}
                  </Text>
                </Row>

                <Column gap="8">
                  {m.definitions.slice(0, 3).map((def, j) => (
                    <Column key={j} gap="4">
                      <Text variant="body-default-m">
                        {j + 1}. {def.definition}
                      </Text>
                      {def.example && (
                        <Text variant="body-default-s" onBackground="neutral-weak">
                          "{def.example}"
                        </Text>
                      )}
                      {def.synonyms && def.synonyms.length > 0 && (
                        <Text variant="body-default-s" onBackground="brand-weak">
                          Synonyms: {def.synonyms.slice(0, 5).join(", ")}
                        </Text>
                      )}
                    </Column>
                  ))}
                </Column>
              </Column>
            ))}
          </Column>
        </Card>
      )}
    </Column>
  );
}
