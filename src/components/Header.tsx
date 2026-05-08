"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Row, ToggleButton, useTheme } from "@once-ui-system/core";

import { routes, display, about, blog, person } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

export const Header = () => {
  const pathname = usePathname() ?? "";
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, []);

  useEffect(() => {
    setCurrentTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoSrc = mounted && currentTheme === "dark"
    ? "/trademarks/wordmark-dark.svg"
    : "/trademarks/wordmark-light.svg";

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{
          position: "fixed",
        }}
      >
        <Row paddingLeft="12" fillWidth vertical="center">
          <a href="/" style={{ textDecoration: "none" }}>
            <img
              src={logoSrc}
              alt="GixMix"
              height="28"
              style={{ display: "block" }}
            />
          </a>
        </Row>
        <Row fillWidth horizontal="center">
          <Row
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Row gap="4" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
              {routes["/"] && (
                <ToggleButton href="/" label="Home" selected={pathname === "/"} />
              )}
              <Row s={{ hide: true }}>
                <ToggleButton
                  href="/tools"
                  label="Tools"
                  selected={pathname === "/tools" || pathname.startsWith("/tools/")}
                />
              </Row>
              <Row hide s={{ hide: false }}>
                <ToggleButton
                  href="/tools"
                  selected={pathname === "/tools" || pathname.startsWith("/tools/")}
                />
              </Row>
              {routes["/features"] && (
                <ToggleButton
                  href="/features"
                  label="Features"
                  selected={pathname === "/features"}
                />
              )}
              {routes["/about"] && (
                <ToggleButton
                  href="/about"
                  label={about.label}
                  selected={pathname === "/about"}
                />
              )}
              {routes["/blog"] && (
                <ToggleButton
                  href="/blog"
                  label={blog.label}
                  selected={pathname.startsWith("/blog")}
                />
              )}
              {routes["/contact"] && (
                <ToggleButton
                  href="/contact"
                  label="Contact"
                  selected={pathname === "/contact"}
                />
              )}
              {display.themeSwitcher && <ThemeToggle />}
            </Row>
          </Row>
        </Row>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            <Flex s={{ hide: true }}>
              {display.time && <div>{person.location}</div>}
            </Flex>
          </Flex>
        </Flex>
      </Row>

      {/* Mobile hamburger */}
      <Row hide s={{ hide: false }} fillWidth padding="8" position="fixed" style={{ top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Row fillWidth horizontal="end" gap="8" padding="4">
          {display.themeSwitcher && <ThemeToggle />}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            style={{
              background: "var(--neutral-surface)",
              border: "1px solid var(--neutral-border-medium)",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              color: "var(--neutral-on-background-strong)",
              fontSize: "1.2rem",
              lineHeight: 1,
            }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </Row>
      </Row>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "52px",
            left: "12px",
            right: "12px",
            background: "var(--neutral-surface)",
            border: "1px solid var(--neutral-border-medium)",
            borderRadius: "16px",
            padding: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <ToggleButton href="/" label="Home" selected={pathname === "/"} fillWidth onClick={() => setMobileOpen(false)} />
          <ToggleButton href="/tools" label="Tools" selected={pathname === "/tools" || pathname.startsWith("/tools/")} fillWidth onClick={() => setMobileOpen(false)} />
          {routes["/features"] && <ToggleButton href="/features" label="Features" selected={pathname === "/features"} fillWidth onClick={() => setMobileOpen(false)} />}
          {routes["/about"] && <ToggleButton href="/about" label={about.label} selected={pathname === "/about"} fillWidth onClick={() => setMobileOpen(false)} />}
          {routes["/blog"] && <ToggleButton href="/blog" label={blog.label} selected={pathname.startsWith("/blog")} fillWidth onClick={() => setMobileOpen(false)} />}
          {routes["/contact"] && <ToggleButton href="/contact" label="Contact" selected={pathname === "/contact"} fillWidth onClick={() => setMobileOpen(false)} />}
        </div>
      )}
    </>
  );
};
