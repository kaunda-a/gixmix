"use client";

import { useState, useMemo } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Card,
  Icon,
  Textarea,
} from "@once-ui-system/core";
import { ContentLocker } from "@/components/monetization/content-locker";

interface WordFreq {
  word: string;
  count: number;
  density: number;
}

function analyzeText(text: string, minLen = 2): WordFreq[] {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s'-]/g, "");
  const words = cleaned.split(/\s+/).filter((w) => w.length >= minLen);
  const total = words.length;
  if (total === 0) return [];

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  return Object.entries(freq)
    .map(([word, count]) => ({ word, count, density: +(count / total * 100).toFixed(3) }))
    .sort((a, b) => b.count - a.count);
}

function filterStopWords(words: WordFreq[]): WordFreq[] {
  const stops = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "by", "with", "from", "as", "is", "it", "its", "this", "that",
    "was", "were", "be", "been", "being", "have", "has", "had", "do", "does",
    "did", "will", "would", "could", "should", "may", "might", "shall",
    "can", "not", "no", "nor", "so", "if", "then", "than", "too", "very",
    "just", "about", "up", "out", "off", "over", "all", "each", "every",
    "both", "few", "more", "most", "some", "any", "he", "she", "they",
    "them", "their", "we", "you", "your", "my", "me", "our", "who", "which",
    "what", "when", "where", "why", "how",
  ]);
  return words.filter((w) => !stops.has(w.word));
}

function getNgrams(text: string, n: number): WordFreq[] {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s'-]/g, "");
  const words = cleaned.split(/\s+/).filter(Boolean);
  const freq: Record<string, number> = {};
  for (let i = 0; i <= words.length - n; i++) {
    const phrase = words.slice(i, i + n).join(" ");
    freq[phrase] = (freq[phrase] || 0) + 1;
  }
  const total = words.length;
  return Object.entries(freq)
    .map(([word, count]) => ({ word, count, density: +(count / total * 100).toFixed(3) }))
    .sort((a, b) => b.count - a.count);
}

export default function KeywordDensityPage() {
  const [text, setText] = useState("");
  const [minLen, setMinLen] = useState(2);
  const [analyzed, setAnalyzed] = useState(false);

  const wordCount = useMemo(() => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }, [text]);

  const charCount = text.length;

  const rawResults = useMemo(() => {
    if (!analyzed || !text.trim()) return [];
    return analyzeText(text, minLen);
  }, [text, minLen, analyzed]);

  const topTen = useMemo(() => rawResults.slice(0, 10), [rawResults]);

  const filteredResults = useMemo(() => filterStopWords(rawResults), [rawResults]);

  const bigrams = useMemo(() => {
    if (!analyzed || !text.trim()) return [];
    return getNgrams(text, 2).slice(0, 20);
  }, [text, analyzed]);

  const trigrams = useMemo(() => {
    if (!analyzed || !text.trim()) return [];
    return getNgrams(text, 3).slice(0, 20);
  }, [text, analyzed]);

  const handleExport = () => {
    const csv = "word,count,density(%)\n" + rawResults.map((w) => `"${w.word}",${w.count},${w.density}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keyword-density-analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Keyword Density Analyzer
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Analyze keyword frequency and density in any text to optimize your content for SEO
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="m">
          <Textarea
            id="kd-text"
            label="Paste Your Content"
            value={text}
            onChange={(e) => { setText(e.target.value); setAnalyzed(false); }}
            placeholder="Paste or type your article, blog post, or webpage content here..."
            rows={10}
          />

          <Row gap="m" vertical="center" fillWidth horizontal="between">
            <Row gap="8" vertical="center">
              <Text variant="body-default-s" onBackground="neutral-weak">
                Words: {wordCount} &middot; Characters: {charCount}
              </Text>
            </Row>
            <Flex gap="8" vertical="center">
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Min word length:
              </Text>
              <select
                value={minLen}
                onChange={(e) => setMinLen(Number(e.target.value))}
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "var(--radius-s)",
                  border: "1px solid var(--neutral-alpha-medium)",
                  background: "var(--surface-background-medium)",
                  color: "var(--neutral-on-background-strong)",
                  fontSize: "0.85rem",
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </Flex>
          </Row>

          <Flex fillWidth horizontal="end">
            <Button size="l" variant="primary" onClick={() => setAnalyzed(true)} disabled={!text.trim()}>
              Analyze
            </Button>
          </Flex>
        </Column>
      </Card>

      {analyzed && rawResults.length > 0 && (
        <>
          <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
            <Column gap="m">
              <Heading as="h2" variant="heading-strong-m">
                Top Keywords
              </Heading>
              <Row fillWidth padding="m" border="neutral-alpha-weak" radius="s">
                <Column gap="4" fillWidth>
                  <Row fillWidth horizontal="between" paddingBottom="8" style={{ borderBottom: "1px solid var(--neutral-alpha-weak)" }}>
                    <Text variant="label-default-xs" onBackground="neutral-weak" style={{ width: "40%" }}>Keyword</Text>
                    <Text variant="label-default-xs" onBackground="neutral-weak" style={{ width: "20%", textAlign: "right" }}>Count</Text>
                    <Text variant="label-default-xs" onBackground="neutral-weak" style={{ width: "30%", textAlign: "right" }}>Density</Text>
                  </Row>
                  {topTen.map((w, i) => (
                    <Row key={w.word} fillWidth horizontal="between" paddingY="4">
                      <Text variant="body-default-m" style={{ width: "40%" }}>
                        {i + 1}. {w.word}
                      </Text>
                      <Text variant="body-default-m" style={{ width: "20%", textAlign: "right" }}>
                        {w.count}
                      </Text>
                      <Text variant="body-default-m" style={{ width: "30%", textAlign: "right" }}>
                        {w.density}%
                      </Text>
                    </Row>
                  ))}
                </Column>
              </Row>
              <Text variant="body-default-xs" onBackground="neutral-weak" align="center">
                Showing top 10 of {rawResults.length} keywords
              </Text>
            </Column>
          </Card>

          <ContentLocker
            title="Unlock Full Analysis"
            description={`Complete a quick offer to unlock the complete report with all ${rawResults.length} keywords, stop word filtering, n-gram analysis, and CSV export`}
          >
            <Card fillWidth padding="l" radius="m" border="success-alpha-weak" background="page">
              <Column gap="l">
                <Row gap="8" vertical="center">
                  <Icon name="shield" size="l" />
                  <Heading as="h2" variant="heading-strong-m">
                    Complete Keyword Analysis
                  </Heading>
                </Row>

                <Column gap="m">
                  <Heading as="h3" variant="heading-strong-xs">
                    All Keywords ({rawResults.length})
                  </Heading>
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <Column gap="2" fillWidth>
                      {rawResults.map((w, i) => (
                        <Row key={w.word} fillWidth horizontal="between" paddingY="2">
                          <Text variant="body-default-s" style={{ width: "40%" }}>{i + 1}. {w.word}</Text>
                          <Text variant="body-default-s" style={{ width: "20%", textAlign: "right" }}>{w.count}</Text>
                          <Text variant="body-default-s" style={{ width: "30%", textAlign: "right" }}>{w.density}%</Text>
                        </Row>
                      ))}
                    </Column>
                  </div>
                </Column>

                <Column gap="m">
                  <Heading as="h3" variant="heading-strong-xs">
                    Without Stop Words ({filteredResults.length})
                  </Heading>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <Column gap="2" fillWidth>
                      {filteredResults.slice(0, 30).map((w, i) => (
                        <Row key={w.word} fillWidth horizontal="between" paddingY="2">
                          <Text variant="body-default-s" style={{ width: "40%" }}>{i + 1}. {w.word}</Text>
                          <Text variant="body-default-s" style={{ width: "20%", textAlign: "right" }}>{w.count}</Text>
                          <Text variant="body-default-s" style={{ width: "30%", textAlign: "right" }}>{w.density}%</Text>
                        </Row>
                      ))}
                    </Column>
                  </div>
                </Column>

                <Column gap="m">
                  <Heading as="h3" variant="heading-strong-xs">
                    2-Word Phrases (Top 20)
                  </Heading>
                  <Column gap="2" fillWidth>
                    {bigrams.map((w, i) => (
                      <Row key={w.word} fillWidth horizontal="between" paddingY="2">
                        <Text variant="body-default-s" style={{ width: "50%" }}>{i + 1}. {w.word}</Text>
                        <Text variant="body-default-s" style={{ width: "20%", textAlign: "right" }}>{w.count}</Text>
                        <Text variant="body-default-s" style={{ width: "30%", textAlign: "right" }}>{w.density}%</Text>
                      </Row>
                    ))}
                  </Column>
                </Column>

                <Column gap="m">
                  <Heading as="h3" variant="heading-strong-xs">
                    3-Word Phrases (Top 20)
                  </Heading>
                  <Column gap="2" fillWidth>
                    {trigrams.map((w, i) => (
                      <Row key={w.word} fillWidth horizontal="between" paddingY="2">
                        <Text variant="body-default-s" style={{ width: "50%" }}>{i + 1}. {w.word}</Text>
                        <Text variant="body-default-s" style={{ width: "20%", textAlign: "right" }}>{w.count}</Text>
                        <Text variant="body-default-s" style={{ width: "30%", textAlign: "right" }}>{w.density}%</Text>
                      </Row>
                    ))}
                  </Column>
                </Column>

                <Button size="l" variant="primary" onClick={handleExport}>
                  Export Full Report (CSV)
                </Button>
              </Column>
            </Card>
          </ContentLocker>
        </>
      )}

      {analyzed && rawResults.length === 0 && (
        <Text variant="body-default-s" onBackground="neutral-weak" align="center">
          No keywords found. Try pasting longer content or reducing the minimum word length.
        </Text>
      )}
    </Column>
  );
}
