"use client";

import { useEffect, useRef } from "react";
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

interface URLLockerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  lockerId?: string;
  downloadUrl?: string;
  redirectUrl?: string;
  fileName?: string;
}

export const URLLocker: React.FC<URLLockerProps> = ({
  title = "Download Unlocked",
  description = "Complete one offer to access this download",
  ctaText = "Access Download",
  lockerId = "1894762",
  downloadUrl,
  redirectUrl,
  fileName,
}) => {
  const { unlocked, loading, error, showWidget, activate, forceComplete, reset } = useLocker({ lockerId });
  const autoTriggered = useRef(false);

  useEffect(() => {
    if (unlocked && !autoTriggered.current && (downloadUrl || redirectUrl)) {
      autoTriggered.current = true;
      const timer = setTimeout(() => {
        if (downloadUrl) window.open(downloadUrl, "_blank");
        if (redirectUrl) window.location.href = redirectUrl;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [unlocked, downloadUrl, redirectUrl]);

  const handleDownload = () => {
    if (downloadUrl) window.open(downloadUrl, "_blank");
    if (redirectUrl) window.location.href = redirectUrl;
  };

  if (unlocked) {
    return (
      <RevealFx translateY="8" fillWidth>
        <Card
          fillWidth
          padding="xl"
          radius="m"
          border="success-alpha-weak"
          background="page"
          style={{ position: "relative", overflow: "hidden" }}
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
          <Column gap="m" horizontal="center" align="center">
            <Icon name="shield" size="l" />
            <Heading variant="heading-strong-m">Access Granted</Heading>
            <Text onBackground="neutral-weak" variant="body-default-m" align="center">
              {downloadUrl || redirectUrl ? "Your download should start automatically" : "Your content is ready"}
            </Text>
            {(downloadUrl || redirectUrl) && (
              <Button size="l" variant="primary" onClick={handleDownload}>
                {fileName ? `Download ${fileName}` : "Download Now"}
              </Button>
            )}
            {process.env.NODE_ENV === "development" && (
              <Button size="s" variant="tertiary" onClick={reset}>
                Reset (Dev)
              </Button>
            )}
          </Column>
        </Card>
      </RevealFx>
    );
  }

  return (
    <RevealFx translateY="8" fillWidth>
      <Card
        fillWidth
        padding="xl"
        radius="m"
        border="brand-alpha-medium"
        background="page"
        style={{ position: "relative", overflow: "hidden" }}
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

        {/* CPA Grip widget mount point */}
        <div
          id={`cpagrip-${lockerId}`}
          style={{ display: showWidget ? "block" : "none" }}
        />

        <Column gap="l" horizontal="center" align="center">
          <Row gap="16" vertical="center">
            <Icon name="lock" size="l" />
            <Icon name="document" size="l" />
          </Row>

          <Heading variant="heading-strong-m" align="center">
            {title}
          </Heading>

          <Text onBackground="neutral-weak" variant="body-default-m" align="center">
            {description}
          </Text>

          {fileName && (
            <Card fillWidth padding="m" radius="s" border="neutral-alpha-weak" background="surface">
              <Row gap="12" vertical="center">
                <Icon name="document" size="m" />
                <Text variant="body-default-m">{fileName}</Text>
              </Row>
            </Card>
          )}

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

          <Button size="l" variant="primary" onClick={activate} disabled={loading}>
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

          <Text onBackground="neutral-weak" variant="body-default-xs" align="center">
            No credit card &middot; Takes 1-2 minutes
          </Text>

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
