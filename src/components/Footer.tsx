"use client";

import { useEffect, useState } from "react";
import { Row, IconButton, useTheme } from "@once-ui-system/core";
import { social } from "@/resources";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

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

  return (
    <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }}>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
        }}
      >
        <Row gap="12" vertical="center">
          <a href="/" style={{ textDecoration: "none" }}>
            <img
              src={logoSrc}
              alt="GixMix"
              height="24"
              style={{ display: "block" }}
            />
          </a>
          <span style={{ color: "var(--neutral-on-background-weak)", fontSize: "0.875rem" }}>
            © {currentYear}
          </span>
        </Row>
        <Row gap="16">
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
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
