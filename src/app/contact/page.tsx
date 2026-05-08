"use client";

import { useState } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Button,
  Input,
  Card,
} from "@once-ui-system/core";
import { contact } from "@/resources";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:${contact.email}?subject=GixMix Contact - ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
    window.open(mailto);
    setSent(true);
  };

  return (
    <Column maxWidth="s" gap="xl" paddingY="12" horizontal="center">
      <Column gap="m" horizontal="center" align="center">
        <Heading variant="display-strong-xs" align="center">
          Contact Us
        </Heading>
        <Text onBackground="neutral-weak" variant="body-default-l" align="center" wrap="balance">
          Have a suggestion, bug report, or just want to say hi? We&apos;d love to hear from you.
        </Text>
      </Column>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <form onSubmit={handleSubmit}>
          <Column gap="m">
            <Input
              id="name"
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
            <Input
              id="email"
              label="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
            <Input
              id="message"
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind..."
              required
            />
            <Flex fillWidth horizontal="end">
              <Button size="l" variant="primary" type="submit">
                {sent ? "Message Sent!" : "Send Message"}
              </Button>
            </Flex>
          </Column>
        </form>
      </Card>

      {sent && (
        <Text variant="body-default-m" onBackground="brand-weak" align="center">
          Thanks! Your message has been prepared. Just click send in your email client.
        </Text>
      )}

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="s" horizontal="center" align="center">
          <Text variant="body-default-s" onBackground="neutral-weak">
            Or email us directly at
          </Text>
          <a href={`mailto:${contact.email}`} style={{ color: "var(--brand-on-background-strong)", fontWeight: 600, textDecoration: "none" }}>
            {contact.email}
          </a>
        </Column>
      </Card>
    </Column>
  );
}
