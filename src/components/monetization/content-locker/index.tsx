"use client";

import { type ReactNode } from "react";
import {
  Column,
  Heading,
  Text,
  Button,
  Card,
  Icon,
  RevealFx,
  Row,
} from "@once-ui-system/core";
import { useLocker } from "../cpa-grip/useLocker";

interface ContentLockerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  ctaText?: string;
  lockerId?: string;
  mode?: "page" | "component";
}

export const ContentLocker: React.FC<ContentLockerProps> = ({
  children,
  title = "Premium Content",
  description = "Complete a quick offer to unlock this content",
  ctaText = "Unlock Now",
  lockerId = "1894762",
  mode = "component",
}) => {
  const { unlocked, loading, error, activate, forceComplete, reset } = useLocker({ lockerId });

  const handleUnlock = () => {
    if (mode === "page") {
      window.lck = false;
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = `https://quartzfiles.com/script_include.php?id=${lockerId}`;
      s.onload = () => {
        if (!window.lck) {
          window.top!.location.href = "https://quartzfiles.com/help/ablk.php?lkt=1";
        }
      };
      document.head.appendChild(s);
      return;
    }
    activate();
  };

  if (unlocked) return <>{children}</>;

  return (
    <RevealFx translateY="8" fillWidth>
      <Card
        fillWidth
        padding="xl"
        radius="m"
        border="brand-alpha-medium"
        background="page"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, var(--brand-background-strong), var(--accent-background-strong))",
          }}
        />
        <Column gap="l" horizontal="center" align="center">
          <Row gap="12" vertical="center">
            <Icon name="lock" size="l" />
            <Icon name="gift" size="l" />
          </Row>
          <Heading variant="heading-strong-m" align="center">
            {title}
          </Heading>
          <Text onBackground="neutral-weak" variant="body-default-m" align="center">
            {description}
          </Text>

          {error && (
            <Column gap="8" horizontal="center" align="center">
              <Text variant="body-default-s" onBackground="danger-weak" align="center">
                {error}
              </Text>
              <Button size="s" variant="tertiary" onClick={activate}>
                Retry
              </Button>
            </Column>
          )}

          <Button size="l" variant="primary" onClick={handleUnlock} disabled={loading}>
            {loading ? "Loading..." : ctaText}
          </Button>

          {loading && (
            <Button size="s" variant="secondary" onClick={forceComplete}>
              I've completed the offer
            </Button>
          )}

          <Column gap="4" horizontal="center" align="center">
            <Text onBackground="neutral-weak" variant="body-default-s" align="center">
              No credit card required. Just complete a quick offer.
            </Text>
            <Text onBackground="neutral-weak" variant="body-default-xs" align="center">
              100% free &middot; Takes 1-2 minutes
            </Text>
          </Column>

          {process.env.NODE_ENV === "development" && (
            <Button size="s" variant="tertiary" onClick={reset}>
              Reset (Dev)
            </Button>
          )}
        </Column>
      </Card>
    </RevealFx>
  );
};
