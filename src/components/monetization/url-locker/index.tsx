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
  const { unlocked, loading, error, activate, forceComplete } = useLocker({ lockerId });

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
              Your download is ready
            </Text>
            {(downloadUrl || redirectUrl) && (
              <Button size="l" variant="primary" onClick={handleDownload}>
                {fileName ? `Download ${fileName}` : "Download Now"}
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
        <Column gap="l" horizontal="center" align="center">
          <Row gap="12" vertical="center">
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
