"use client";

import { useEffect, useState } from "react";
import { Row } from "@once-ui-system/core";

interface BannerProps {
  id: string;
  message: string;
  linkText?: string;
  linkHref?: string;
}

const Banner: React.FC<BannerProps> = ({ id, message, linkText, linkHref }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(`gixmix_banner_${id}`);
    if (stored !== "dismissed") {
      setDismissed(false);
    }
    setVisible(true);
  }, [id]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(`gixmix_banner_${id}`, "dismissed");
    } catch {}
    setDismissed(true);
  };

  if (!visible || dismissed) return null;

  return (
    <Row
      fillWidth
      paddingX="l"
      paddingY="s"
      horizontal="center"
      style={{
        background: "var(--brand-background-strong)",
        position: "relative",
        zIndex: 100,
      }}
    >
      <Row
        maxWidth="l"
        fillWidth
        gap="m"
        horizontal="center"
        vertical="center"
      >
        <span
          style={{
            color: "var(--brand-on-background-strong)",
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          {message}
          {linkText && linkHref && (
            <a
              href={linkHref}
              style={{
                color: "var(--brand-on-background-strong)",
                fontWeight: 600,
                textDecoration: "underline",
                marginLeft: "6px",
              }}
            >
              {linkText}
            </a>
          )}
        </span>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            color: "var(--brand-on-background-strong)",
            cursor: "pointer",
            fontSize: "1.25rem",
            lineHeight: 1,
            padding: "0 4px",
            opacity: 0.8,
            flexShrink: 0,
          }}
        >
          &times;
        </button>
      </Row>
    </Row>
  );
};

export default Banner;
