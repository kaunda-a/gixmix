"use client";

import {
  Column,
  Heading,
  Text,
  Card,
  Icon,
} from "@once-ui-system/core";
import type { Tool } from "@/types";

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
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
  );
};
