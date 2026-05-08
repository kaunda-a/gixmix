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
} from "@once-ui-system/core";
import { home, baseURL, tools } from "@/resources";

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
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l" align="center">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl" align="center">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center">
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
          </RevealFx>
        </Column>
      </Column>

      <RevealFx translateY="16" delay={0.6} fillWidth>
        <Column fillWidth gap="l" paddingTop="40">
          <Row fillWidth horizontal="center">
            <Heading as="h2" variant="display-strong-xs" align="center">
              Featured Tools
            </Heading>
          </Row>
          <Row fillWidth gap="l" wrap={true} horizontal="center">
            {featuredTools.map((tool) => (
              <div
                key={tool.slug}
                style={{ flex: "1 1 300px", maxWidth: "400px" }}
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
    </Column>
  );
}
