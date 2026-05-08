"use client";

import { useState, useCallback } from "react";
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

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "alternating" | "inverse";

const caseOptions: { value: CaseType; label: string }[] = [
  { value: "upper", label: "UPPER CASE" },
  { value: "lower", label: "lower case" },
  { value: "title", label: "Title Case" },
  { value: "sentence", label: "Sentence case" },
  { value: "camel", label: "camelCase" },
  { value: "pascal", label: "PascalCase" },
  { value: "snake", label: "snake_case" },
  { value: "kebab", label: "kebab-case" },
  { value: "alternating", label: "aLtErNaTiNg" },
  { value: "inverse", label: "iNVERSE cASE" },
];

function applyCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case "sentence": {
      const first = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      return first;
    }
    case "camel":
      return text
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase());
    case "pascal":
      return text
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[a-z]/, (c) => c.toUpperCase());
    case "snake":
      return text.replace(/\s+/g, "_").toLowerCase();
    case "kebab":
      return text.replace(/\s+/g, "-").toLowerCase();
    case "alternating":
      return text
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    case "inverse":
      return text
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    default:
      return text;
  }
}

export default function TextConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseType>("upper");
  const [copied, setCopied] = useState(false);

  const convert = useCallback((type: CaseType) => {
    setSelectedCase(type);
    setOutput(applyCase(input, type));
  }, [input]);

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Text Case Converter
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Convert text between different cases and formats
      </Text>

      <Card
        fillWidth
        padding="l"
        radius="m"
        border="neutral-alpha-weak"
        background="page"
      >
        <Column gap="m">
          <Flex fillWidth>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste your text here..."
              style={{
                width: "100%",
                minHeight: "150px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--neutral-border-medium)",
                background: "var(--neutral-surface)",
                color: "var(--neutral-on-background-strong)",
                fontSize: "16px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </Flex>

          <Row gap="4" wrap={true}>
            {caseOptions.map((opt) => (
              <Button
                key={opt.value}
                size="s"
                variant={selectedCase === opt.value ? "primary" : "tertiary"}
                onClick={() => convert(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </Row>
        </Column>
      </Card>

      {output && (
        <Card
          fillWidth
          padding="l"
          radius="m"
          border="neutral-alpha-weak"
          background="page"
        >
          <Column gap="m">
            <Flex fillWidth>
              <textarea
                readOnly
                value={output}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--neutral-border-medium)",
                  background: "var(--neutral-surface)",
                  color: "var(--neutral-on-background-strong)",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </Flex>
            <Flex fillWidth horizontal="end">
              <Button size="m" variant="primary" onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </Flex>
          </Column>
        </Card>
      )}

      <Card
        fillWidth
        padding="l"
        radius="m"
        border="neutral-alpha-weak"
        background="page"
      >
        <Row gap="xl" horizontal="center">
          <Column horizontal="center" align="center">
            <Heading variant="heading-strong-m">{wordCount}</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">Words</Text>
          </Column>
          <Column horizontal="center" align="center">
            <Heading variant="heading-strong-m">{charCount}</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">Characters</Text>
          </Column>
        </Row>
      </Card>
    </Column>
  );
}
