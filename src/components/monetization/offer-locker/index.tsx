"use client";

import { useState } from "react";
import {
  Column,
  Heading,
  Text,
  Button,
  Card,
  Icon,
  RevealFx,
  Row,
  Flex,
} from "@once-ui-system/core";
import { useLocker } from "../cpa-grip/useLocker";

interface Offer {
  id: string;
  title: string;
  description: string;
  payout: string;
  icon: string;
}

interface OfferLockerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  lockerId?: string;
  offers?: Offer[];
}

const defaultOffers: Offer[] = [
  { id: "offer-1", title: "Quick Survey", description: "Answer a few questions", payout: "$0.50 - $2.00", icon: "document" },
  { id: "offer-2", title: "Email Submit", description: "Submit your email for a free trial", payout: "$0.80 - $1.50", icon: "email" },
  { id: "offer-3", title: "App Install", description: "Download and install a partner app", payout: "$1.50 - $5.00", icon: "chip" },
  { id: "offer-4", title: "Free Trial", description: "Sign up for a free trial", payout: "$5.00 - $25.00", icon: "rocket" },
];

export const OfferLocker: React.FC<OfferLockerProps> = ({
  title = "Get Free Rewards",
  description = "Choose an offer below to earn credits and unlock rewards",
  ctaText = "Browse Offers",
  lockerId = "1894762",
  offers = defaultOffers,
}) => {
  const [showOffers, setShowOffers] = useState(false);
  const { unlocked, loading, error, activate, forceComplete } = useLocker({ lockerId });

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
            <Heading variant="heading-strong-m">Congratulations!</Heading>
            <Text onBackground="neutral-weak" variant="body-default-m" align="center">
              You&apos;ve earned your reward. Enjoy!
            </Text>
          </Column>
        </Card>
      </RevealFx>
    );
  }

  if (!showOffers) {
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
              <Icon name="gift" size="l" />
            </Row>
            <Heading variant="heading-strong-m" align="center">
              {title}
            </Heading>
            <Text onBackground="neutral-weak" variant="body-default-m" align="center">
              {description}
            </Text>
            <Button size="l" variant="primary" onClick={() => setShowOffers(true)}>
              {ctaText}
            </Button>
            <Text onBackground="neutral-weak" variant="body-default-xs" align="center">
              No credit card &middot; Complete any 1 offer
            </Text>
          </Column>
        </Card>
      </RevealFx>
    );
  }

  return (
    <RevealFx translateY="8" fillWidth>
      <Card fillWidth padding="xl" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="l" horizontal="center" align="center">
          <Heading variant="heading-strong-m">Choose an Offer</Heading>
          <Text onBackground="neutral-weak" variant="body-default-m" align="center">
            Complete any offer below to unlock your reward
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", width: "100%" }}>
            {offers.map((offer) => (
              <Card
                key={offer.id}
                fillWidth
                padding="m"
                radius="m"
                border="neutral-alpha-weak"
                background="page"
                onClick={activate}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                <Column gap="8" horizontal="center" align="center">
                  <Icon name={offer.icon} size="m" />
                  <Heading as="h3" variant="heading-strong-xs">{offer.title}</Heading>
                  <Text onBackground="neutral-weak" variant="body-default-s" align="center">
                    {offer.description}
                  </Text>
                  <Text variant="body-default-s" onBackground="brand-medium">
                    Payout: {offer.payout}
                  </Text>
                  <Button size="s" variant="primary" disabled={loading}>
                    {loading ? "Loading..." : "Complete"}
                  </Button>
                </Column>
              </Card>
            ))}
          </div>

          {loading && (
            <Button size="s" variant="secondary" onClick={forceComplete}>
              I've completed the offer
            </Button>
          )}
        </Column>
      </Card>
    </RevealFx>
  );
};
