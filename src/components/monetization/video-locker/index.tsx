"use client";

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
  const { unlocked, loading, error, activate, forceComplete } = useLocker({ lockerId });

  if (unlocked && videoUrl) {
    return (
      <RevealFx translateY="8" fillWidth>
        <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
          <Column gap="m">
            <Heading variant="heading-strong-xs">{title}</Heading>
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
          </Column>
        </Card>
      </RevealFx>
    );
  }

  if (unlocked && !videoUrl) {
    return (
      <RevealFx translateY="8" fillWidth>
        <Card fillWidth padding="l" radius="m" border="success-alpha-weak" background="page">
          <Column gap="m" horizontal="center" align="center">
            <Icon name="shield" size="l" />
            <Heading variant="heading-strong-m">Unlocked!</Heading>
            <Text onBackground="neutral-weak" variant="body-default-m">
              Add a <code>videoUrl</code> prop to show your video
            </Text>
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
          {videoThumbnail && (
            <div style={{ width: "100%", maxWidth: "400px", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
              <img src={videoThumbnail} alt={title} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          )}
          {!videoThumbnail && <Icon name="lock" size="xl" />}

          <Row gap="12" vertical="center">
            <Icon name="lock" size="l" />
            <Heading variant="heading-strong-m" align="center">{title}</Heading>
          </Row>
          <Text onBackground="neutral-weak" variant="body-default-m" align="center">{description}</Text>

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

          <Button size="l" variant="primary" onClick={activate} disabled={loading}>
            {loading ? "Loading..." : ctaText}
          </Button>

          {loading && (
            <Button size="s" variant="secondary" onClick={forceComplete}>
              I've completed the offer
            </Button>
          )}

          <Text onBackground="neutral-weak" variant="body-default-xs" align="center">
            No credit card &middot; Takes 1-2 minutes
          </Text>
        </Column>
      </Card>
    </RevealFx>
  );
};
