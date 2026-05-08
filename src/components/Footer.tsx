"use client";

import { useEffect, useState } from "react";
import { Row, Column, Text, SmartLink, IconButton, useTheme } from "@once-ui-system/core";
import { social } from "@/resources";
import { tools } from "@/resources/tools";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, []);

  useEffect(() => {
    setCurrentTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, [theme]);

  const logoSrc = mounted && currentTheme === "dark"
    ? "/trademarks/wordmark-dark.svg"
    : "/trademarks/wordmark-light.svg";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <Column as="footer" fillWidth padding="0">
      {/* Main footer */}
      <Row
        paddingX="xl"
        paddingY="xl"
        fillWidth
        horizontal="center"
        background="page"
        style={{ borderTop: "1px solid var(--neutral-border-medium)" }}
        s={{ direction: "column" }}
      >
        <Row
          maxWidth="l"
          fillWidth
          gap="xl"
          horizontal="between"
          vertical="start"
          s={{ direction: "column" }}
        >
          {/* Column 1: Brand */}
          <Column maxWidth="xs" gap="m">
            <a href="/" style={{ textDecoration: "none" }}>
              <img src={logoSrc} alt="GixMix" height="28" style={{ display: "block" }} />
            </a>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Free online tools for everyone. No sign-ups, no ads, just tools that work.
            </Text>
            <Row gap="12">
              {social.map(
                (item) =>
                  item.link && (
                    <IconButton
                      key={item.name}
                      href={item.link}
                      icon={item.icon}
                      tooltip={item.name}
                      size="s"
                      variant="ghost"
                    />
                  ),
              )}
            </Row>
          </Column>

          {/* Column 2: Tools */}
          <Column gap="s">
            <Text variant="body-default-s" onBackground="neutral-strong" style={{ fontWeight: 600, marginBottom: "4px" }}>
              Tools
            </Text>
            {tools.tools.slice(0, 6).map((tool) => (
              <SmartLink key={tool.slug} href={`/tools/${tool.slug}`}>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {tool.name}
                </Text>
              </SmartLink>
            ))}
            <SmartLink href="/tools">
              <Text variant="body-default-s" onBackground="brand-medium">
                View all tools &rarr;
              </Text>
            </SmartLink>
          </Column>

          {/* Column 3: Links */}
          <Column gap="s">
            <Text variant="body-default-s" onBackground="neutral-strong" style={{ fontWeight: 600, marginBottom: "4px" }}>
              Resources
            </Text>
            <SmartLink href="/blog">
              <Text variant="body-default-s" onBackground="neutral-weak">Blog</Text>
            </SmartLink>
            <SmartLink href="/about">
              <Text variant="body-default-s" onBackground="neutral-weak">About</Text>
            </SmartLink>
            <SmartLink href="/gallery">
              <Text variant="body-default-s" onBackground="neutral-weak">Gallery</Text>
            </SmartLink>
            <SmartLink href="/blog/ebook">
              <Text variant="body-default-s" onBackground="neutral-weak">Free Ebook</Text>
            </SmartLink>
          </Column>

          {/* Column 4: Newsletter */}
          <Column gap="s" maxWidth="xs">
            <Text variant="body-default-s" onBackground="neutral-strong" style={{ fontWeight: 600, marginBottom: "4px" }}>
              Stay Updated
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Get notified when we add new tools.
            </Text>
            <form onSubmit={handleSubscribe} style={{ width: "100%" }}>
              <Row gap="8" s={{ direction: "column" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--neutral-border-medium)",
                    background: "var(--neutral-surface)",
                    color: "var(--neutral-on-background-strong)",
                    fontSize: "0.875rem",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--brand-background-strong)",
                    color: "var(--brand-on-background-strong)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </Row>
            </form>
          </Column>
        </Row>
      </Row>

      {/* Bottom bar */}
      <Row
        fillWidth
        paddingX="xl"
        paddingY="m"
        horizontal="center"
        style={{ borderTop: "1px solid var(--neutral-border-weak)" }}
      >
        <Row
          maxWidth="l"
          fillWidth
          horizontal="between"
          vertical="center"
          s={{ direction: "column" }}
        >
          <Text variant="body-default-xs" onBackground="neutral-weak">
            © {currentYear} GixMix. All rights reserved.
          </Text>
          <Row gap="16">
            <SmartLink href="/about">
              <Text variant="body-default-xs" onBackground="neutral-weak">Privacy</Text>
            </SmartLink>
            <SmartLink href="/about">
              <Text variant="body-default-xs" onBackground="neutral-weak">Terms</Text>
            </SmartLink>
          </Row>
        </Row>
      </Row>

      <Row height="80" hide s={{ hide: false }} />
    </Column>
  );
};
