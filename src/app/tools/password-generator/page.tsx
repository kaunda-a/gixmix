"use client";

import { useState, useCallback } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Input,
  Card,
  Select,
} from "@once-ui-system/core";

type CharType = "uppercase" | "lowercase" | "numbers" | "symbols";

const CHARACTERS: Record<CharType, string> = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [include, setInclude] = useState<CharType[]>(["uppercase", "lowercase", "numbers", "symbols"]);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleInclude = (type: CharType) => {
    setInclude((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const generate = useCallback(() => {
    if (include.length === 0) return;

    let chars = "";
    for (const type of include) {
      chars += CHARACTERS[type];
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
    setCopied(false);
  }, [length, include]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = (): { label: string } => {
    if (length < 8) return { label: "Weak" };
    if (length < 12) return { label: "Medium" };
    if (length < 16) return { label: "Strong" };
    return { label: "Very Strong" };
  };

  const strength = getStrength();

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Password Generator
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Generate strong, secure passwords with customizable options
      </Text>

      <Card
        fillWidth
        padding="l"
        radius="m"
        border="neutral-alpha-weak"
        background="page"
      >
        <Column gap="m">
          <Row gap="m" vertical="center" wrap={true}>
            <Flex flex={1}>
              <Input
                id="length"
                label="Length"
                type="number"
                value={length.toString()}
                onChange={(e) => setLength(Math.max(4, Math.min(128, parseInt(e.target.value) || 8)))}
                min={4}
                max={128}
              />
            </Flex>
            <Flex flex={1}>
              <Text>
                Strength: <strong>{strength.label}</strong>
              </Text>
            </Flex>
          </Row>

          <Text variant="body-default-s" onBackground="neutral-weak">
            Include:
          </Text>
          <Row gap="8" wrap={true}>
            {(["uppercase", "lowercase", "numbers", "symbols"] as CharType[]).map((type) => (
              <Button
                key={type}
                size="s"
                variant={include.includes(type) ? "primary" : "secondary"}
                onClick={() => toggleInclude(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </Row>

          <Flex fillWidth horizontal="center">
            <Button size="l" variant="primary" onClick={generate}>
              Generate Password
            </Button>
          </Flex>
        </Column>
      </Card>

      {password && (
        <Card
          fillWidth
          padding="l"
          radius="m"
          border="neutral-alpha-weak"
          background="page"
        >
          <Column gap="m" horizontal="center" align="center">
            <Heading as="h3" variant="heading-strong-m" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>
              {password}
            </Heading>
            <Row gap="m">
              <Button size="m" variant="primary" onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <Button size="m" variant="secondary" onClick={generate}>
                Regenerate
              </Button>
            </Row>
          </Column>
        </Card>
      )}
    </Column>
  );
}
