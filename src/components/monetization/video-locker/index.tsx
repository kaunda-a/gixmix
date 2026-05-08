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

interface VideoLockerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  lockerId?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export const VideoLocker: React.FC<VideoLockerProps> = ({
  title = "Video Preview",
  description = "Complete a quick offer to watch the full video",
  ctaText = "Watch Video",
  lockerId = "1894762",
  videoUrl,
  videoThumbnail,
}) => {
  const { unlocked, loading, error, activate, forceComplete, reset } = useLocker({ lockerId });
  const autoTriggered = useRef(false);

  useEffect(() => {
    if (unlocked && !autoTriggered.current && videoUrl) {
      autoTriggered.current = true;
    }
  }, [unlocked, videoUrl]);

  if (unlocked) {
    return (
      <RevealFx translateY="8" fillWidth>
        <Card fillWidth padding="l" radius="m" border="success-alpha-weak" background="page">
          <Column gap="m">
            <Row horizontal="between" vertical="center" fillWidth>
              <Row gap="8" vertical="center">
                <Icon name="shield" size="m" />
                <Heading variant="heading-strong-xs">{title}</Heading>
              </Row>
              {process.env.NODE_ENV === "development" && (
                <Button size="s" variant="tertiary" onClick={reset}>
                  Reset (Dev)
                </Button>
              )}
            </Row>
            {videoUrl ? (
              <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
                <iframe
                  src={videoUrl}
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%",
                    border: "none", borderRadius: "var(--radius-m)",
                  }}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              <Card fillWidth padding="xl" radius="m" border="neutral-alpha-weak" background="surface">
                <Column horizontal="center" align="center" gap="m">
                  <Icon name="play" size="l" />
                  <Text variant="body-default-m" align="center">
                    Video ready to play
                  </Text>
                </Column>
              </Card>
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
        <Column gap="l" horizontal="center" align="center">
          {videoThumbnail ? (
            <div style={{ width: "100%", maxWidth: "400px", borderRadius: "var(--radius-m)", overflow: "hidden", position: "relative" }}>
              <img src={videoThumbnail} alt={title} style={{ width: "100%", height: "auto", display: "block" }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <Icon name="play" size="xl" />
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                aspectRatio: "16/9",
                borderRadius: "var(--radius-m)",
                background: "var(--surface-background-medium)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="play" size="xl" />
            </div>
          )}

          <Heading variant="heading-strong-m" align="center">{title}</Heading>
          <Text onBackground="neutral-weak" variant="body-default-m" align="center">{description}</Text>

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
