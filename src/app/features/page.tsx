import {
  Heading,
  Text,
  Column,
  Row,
  Card,
  Icon,
  Schema,
  Meta,
} from "@once-ui-system/core";
import { features, baseURL, tools } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: features.title,
    description: features.description,
    baseURL,
    path: features.path,
  });
}

const featureItems = [
  {
    icon: "tools",
    title: "10+ Free Tools",
    description: "Scientific calculator, currency converter, QR generator, weather, dictionary, and more.",
  },
  {
    icon: "globe",
    title: "No API Keys Needed",
    description: "All tools use free, publicly available APIs. No sign-ups, no paid tiers.",
  },
  {
    icon: "lock",
    title: "Private & Secure",
    description: "Everything runs in your browser. Your data never touches our servers.",
  },
  {
    icon: "rocket",
    title: "Lightning Fast",
    description: "Built on Next.js with static generation for instant page loads.",
  },
  {
    icon: "book",
    title: "Educational Blog",
    description: "Learn how tools work, how to build them, and how to monetize your own tools.",
  },
  {
    icon: "symbol",
    title: "100% Free",
    description: "No hidden costs, no premium tiers. All features are free forever.",
  },
];

export default function FeaturesPage() {
  const categories = [...new Set(tools.tools.map((t) => t.category))];

  return (
    <Column maxWidth="s" gap="xl" paddingY="12" horizontal="center">
      <Schema as="webPage" baseURL={baseURL} path={features.path} title={features.title} description={features.description} />

      <Column gap="m" horizontal="center" align="center">
        <Heading variant="display-strong-xs" align="center">
          Features
        </Heading>
        <Text onBackground="neutral-weak" variant="body-default-l" align="center" wrap="balance">
          Everything GixMix offers — all free, all in your browser.
        </Text>
      </Column>

      <Row gap="l" wrap fillWidth>
        {featureItems.map((f) => (
          <div key={f.title} style={{ flex: "1 1 280px", maxWidth: "400px" }}>
            <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
              <Column gap="m" horizontal="center" align="center">
                <Icon name={f.icon} size="xl" />
                <Heading as="h3" variant="heading-strong-m">
                  {f.title}
                </Heading>
                <Text onBackground="neutral-weak" variant="body-default-s" align="center">
                  {f.description}
                </Text>
              </Column>
            </Card>
          </div>
        ))}
      </Row>

      <Heading as="h2" variant="display-strong-xs" align="center" paddingTop="24">
        Tool Categories
      </Heading>
      <Row gap="m" wrap fillWidth horizontal="center">
        {categories.map((cat) => (
          <div
            key={cat}
            style={{
              padding: "0.3rem 1rem",
              borderRadius: "999px",
              background: "var(--brand-background-weak)",
              color: "var(--brand-on-background-weak)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {cat}
          </div>
        ))}
      </Row>
    </Column>
  );
}
