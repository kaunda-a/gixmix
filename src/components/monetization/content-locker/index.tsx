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
  const { unlocked, loading, error, progress, activate, forceComplete, reset } = useLocker({ lockerId });

  const handleUnlock = () => {
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

        {loading && (
          <div
            style={{
              position: "absolute",
              top: 3,
              left: 0,
              height: "3px",
              width: `${progress}%`,
              background: "var(--brand-background-strong)",
              transition: "width 0.5s ease",
              zIndex: 1,
            }}
          />
        )}

        <Column gap="l" horizontal="center" align="center">
          <Icon name="lock" size="xl" />

          <Heading variant="heading-strong-m" align="center">
            {title}
          </Heading>

          <Text onBackground="neutral-weak" variant="body-default-m" align="center">
            {description}
          </Text>

          {error && (
            <Card fillWidth padding="m" radius="s" border="danger-alpha-weak" background="page">
              <Column gap="8" horizontal="center" align="center">
                <Icon name="warning" size="m" />
                <Text variant="body-default-s" onBackground="danger-weak" align="center">
                  {error}
                </Text>
                <Button size="s" variant="secondary" onClick={activate}>
                  Try Again
                </Button>
              </Column>
            </Card>
          )}

          <Column gap="12" horizontal="center" align="center">
            <Button size="l" variant="primary" onClick={handleUnlock} disabled={loading}>
              {loading ? (
                <Row gap="8" vertical="center">
                  <span style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    border: "2px solid var(--brand-on-background-strong)",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Loading...
                </Row>
              ) : (
                ctaText
              )}
            </Button>

            {loading && (
              <Button size="s" variant="secondary" onClick={forceComplete}>
                I've completed the offer
              </Button>
            )}
          </Column>

          <Column gap="4" horizontal="center" align="center">
            <Text onBackground="neutral-weak" variant="body-default-s" align="center">
              No credit card required. Just complete a quick offer.
            </Text>
            <Text onBackground="neutral-weak" variant="body-default-xs" align="center">
              100% free &middot; Takes 1-2 minutes
            </Text>
          </Column>

          {process.env.NODE_ENV === "development" && (
            <Row gap="8" horizontal="center">
              <Button size="s" variant="tertiary" onClick={forceComplete}>
                Force Unlock (Dev)
              </Button>
              <Button size="s" variant="tertiary" onClick={reset}>
                Reset (Dev)
              </Button>
            </Row>
          )}
        </Column>
      </Card>
    </RevealFx>
  );
};
