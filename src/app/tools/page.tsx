import {
  Heading,
  Text,
  Column,
  Row,
  Schema,
  Meta,
  Card,
  Icon,
} from "@once-ui-system/core";
import { baseURL, tools } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: tools.title + " – GixMix",
    description: tools.description,
    baseURL: baseURL,
    path: "/tools",
  });
}

export default function ToolsPage() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/tools"
        title={tools.title}
        description={tools.description}
      />
      <Column fillWidth horizontal="center" gap="l">
        <Column maxWidth="s" horizontal="center" align="center" gap="12">
          <Heading variant="display-strong-l" align="center">
            {tools.title}
          </Heading>
          <Text onBackground="neutral-weak" variant="heading-default-xs" align="center">
            {tools.description}
          </Text>
        </Column>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            width: "100%",
          }}
        >
          {tools.tools.map((tool) => (
            <Card
              key={tool.slug}
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
          ))}
        </div>
      </Column>
    </Column>
  );
}
