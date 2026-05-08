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
  Icon,
} from "@once-ui-system/core";
import { ContentLocker } from "@/components/monetization/content-locker";

interface DatamuseWord {
  word: string;
  score: number;
  tags?: string[];
}

export default function KeywordIdeasPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freeResults, setFreeResults] = useState<DatamuseWord[]>([]);
  const [allResults, setAllResults] = useState<DatamuseWord[]>([]);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("Enter a seed keyword");
      return;
    }

    setLoading(true);
    setError(null);
    setFreeResults([]);
    setAllResults([]);

    try {
      // Fetch related meaning words
      const mlRes = await fetch(
        `https://api.datamuse.com/words?ml=${encodeURIComponent(keyword.trim())}&max=50`
      );
      if (!mlRes.ok) throw new Error("Keyword service unavailable");
      const mlData: DatamuseWord[] = await mlRes.json();

      // Fetch autocomplete suggestions
      const sugRes = await fetch(
        `https://api.datamuse.com/sug?s=${encodeURIComponent(keyword.trim())}`
      );
      if (!sugRes.ok) throw new Error("Suggestion service unavailable");
      const sugData: DatamuseWord[] = await sugRes.json();

      // Merge and deduplicate
      const seen = new Set<string>();
      const merged: DatamuseWord[] = [];
      for (const item of [...mlData, ...sugData]) {
        if (!seen.has(item.word.toLowerCase())) {
          seen.add(item.word.toLowerCase());
          merged.push(item);
        }
      }

      if (merged.length === 0) {
        throw new Error("No keyword ideas found. Try a different seed keyword.");
      }

      // First 5 are free, rest are locked
      setFreeResults(merged.slice(0, 5));
      setAllResults(merged.slice(5));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch keyword ideas");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const all = [...freeResults, ...allResults];
    const csv = "keyword,score\n" + all.map((w) => `"${w.word}",${w.score}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keyword-ideas-${keyword.trim().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Keyword Ideas Generator
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Enter a seed keyword to discover related keyword ideas for your SEO strategy
      </Text>
      <Text onBackground="neutral-weak" variant="body-default-s" align="center">
        Powered by Datamuse API (free, no API key required)
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="m">
          <Input
            id="keyword"
            label="Seed Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. seo tools, keyword research, backlink checker"
          />

          <Flex fillWidth horizontal="end">
            <Button size="l" variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Generating..." : "Generate Ideas"}
            </Button>
          </Flex>
        </Column>
      </Card>

      {error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}

      {freeResults.length > 0 && (
        <>
          <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
            <Column gap="m">
              <Row horizontal="between" vertical="center" fillWidth>
                <Heading as="h2" variant="heading-strong-m">
                  Keyword Ideas for &quot;{keyword}&quot;
                </Heading>
                <Text variant="body-default-s" onBackground="brand-medium">
                  {freeResults.length + allResults.length} found
                </Text>
              </Row>

              <Column gap="4">
                {freeResults.map((w, i) => (
                  <Row
                    key={w.word}
                    fillWidth
                    padding="m"
                    radius="s"
                    border="neutral-alpha-weak"
                    horizontal="between"
                    vertical="center"
                  >
                    <Row gap="12" vertical="center">
                      <Text
                        variant="body-default-s"
                        onBackground="neutral-weak"
                        style={{ minWidth: "24px" }}
                      >
                        {i + 1}.
                      </Text>
                      <Text variant="body-default-m">{w.word}</Text>
                    </Row>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      relevance: {w.score}
                    </Text>
                  </Row>
                ))}
              </Column>

              <Text variant="body-default-s" onBackground="neutral-weak" align="center">
                Showing 5 of {freeResults.length + allResults.length} keyword ideas
              </Text>
            </Column>
          </Card>

          <ContentLocker
            title="Unlock All Keyword Ideas"
            description={`Complete a quick offer to unlock all ${allResults.length} remaining keyword ideas plus CSV export`}
          >
            <Card fillWidth padding="l" radius="m" border="success-alpha-weak" background="page">
              <Column gap="m">
                <Row gap="8" vertical="center">
                  <Icon name="shield" size="l" />
                  <Heading as="h2" variant="heading-strong-m">
                    All {freeResults.length + allResults.length} Keyword Ideas
                  </Heading>
                </Row>

                <Column gap="4">
                  {[...freeResults, ...allResults].map((w, i) => (
                    <Row
                      key={w.word}
                      fillWidth
                      padding="m"
                      radius="s"
                      border="neutral-alpha-weak"
                      horizontal="between"
                      vertical="center"
                    >
                      <Row gap="12" vertical="center">
                        <Text
                          variant="body-default-s"
                          onBackground="neutral-weak"
                          style={{ minWidth: "24px" }}
                        >
                          {i + 1}.
                        </Text>
                        <Text variant="body-default-m">{w.word}</Text>
                      </Row>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        relevance: {w.score}
                      </Text>
                    </Row>
                  ))}
                </Column>

                <Button size="l" variant="primary" onClick={handleExport}>
                  Export CSV
                </Button>
              </Column>
            </Card>
          </ContentLocker>
        </>
      )}
    </Column>
  );
}
