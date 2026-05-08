import {
  Heading,
  Text,
  Button,
  RevealFx,
  Column,
  Row,
  Schema,
  Meta,
  Card,
  Icon,
  Flex,
} from "@once-ui-system/core";
import { home, baseURL, tools } from "@/resources";
import LandingLayout from "@/components/LandingLayout";
import EncryptedText from "@/components/EncryptedText";
import { Mailchimp } from "@/components/Mailchimp";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  const featuredTools = tools.tools.filter((t) => t.featured);

  return (
    <LandingLayout>
      <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
        <Schema
          as="webPage"
          baseURL={baseURL}
          path={home.path}
          title={home.title}
          description={home.description}
        />

        <Column fillWidth horizontal="center" gap="m" paddingTop="48">
          <Column maxWidth="s" horizontal="center" align="center">
            <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
              <Heading wrap="balance" variant="display-strong-l" align="center">
                <EncryptedText
                  text="Free online tools for everyone"
                  as="span"
                  speed={40}
                  triggerOnView
                  triggerOnHover={false}
                  delay={300}
                />
              </Heading>
            </RevealFx>
            <RevealFx translateY="8" delay={0.4} fillWidth horizontal="center" paddingBottom="32">
              <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl" align="center">
                <EncryptedText
                  text="A collection of free, fast, and easy-to-use online tools. No sign-ups, no ads, just tools that work."
                  as="span"
                  speed={25}
                  chars="·~*─═"
                  triggerOnView
                  triggerOnHover={false}
                  delay={1500}
                />
              </Text>
            </RevealFx>
            <RevealFx paddingTop="12" delay={0.8} horizontal="center">
              <Flex gap="16" horizontal="center" wrap>
                <Button
                  id="tools"
                  data-border="rounded"
                  href="/tools"
                  variant="primary"
                  size="l"
                  weight="default"
                  arrowIcon
                >
                  Browse All Tools
                </Button>
                <Button
                  id="browse"
                  data-border="rounded"
                  href="/features"
                  variant="secondary"
                  size="l"
                  weight="default"
                >
                  See Features
                </Button>
              </Flex>
            </RevealFx>
          </Column>
        </Column>

        <RevealFx translateY="16" delay={1.2} fillWidth>
          <Column fillWidth gap="l" paddingTop="64">
            <Row fillWidth horizontal="center">
              <Heading as="h2" variant="display-strong-xs" align="center">
                All Tools
              </Heading>
            </Row>
            <Row fillWidth gap="l" wrap horizontal="center">
              {featuredTools.map((tool) => (
                <div
                  key={tool.slug}
                  style={{ flex: "1 1 280px", maxWidth: "360px" }}
                >
                  <Card
                    fillWidth
                    padding="l"
                    radius="m"
                    border="neutral-alpha-weak"
                    background="page"
                    href={`/tools/${tool.slug}`}
                  >
                    <Column gap="m" horizontal="center" align="center">
                      <Icon name={tool.icon} size="xl" />
                      <Heading as="h3" variant="heading-strong-m">
                        {tool.name}
                      </Heading>
                      <Text onBackground="neutral-weak" variant="body-default-s" align="center">
                        {tool.description}
                      </Text>
                    </Column>
                  </Card>
                </div>
              ))}
            </Row>
          </Column>
        </RevealFx>

        <RevealFx translateY="16" delay={1.4} fillWidth>
          <Mailchimp />
        </RevealFx>
      </Column>
    </LandingLayout>
  );
}
