"use client";

import { useState, useCallback, type ReactNode } from "react";
import {
  Column,
  Heading,
  Text,
  Button,
  Flex,
  Card,
  Icon,
  RevealFx,
} from "@once-ui-system/core";

export interface ContentLockerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  lockerId?: string;
  showLock?: boolean;
}

export const ContentLocker: React.FC<ContentLockerProps> = ({
  children,
  title = "Premium Content",
  description = "Complete a quick offer to unlock this content",
  lockerId,
  showLock = true,
}) => {
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <RevealFx translateY="8" fillWidth>
      <Card
        fillWidth
        padding="xl"
        radius="m"
        border="neutral-alpha-weak"
        background="page"
      >
        <Column gap="l" horizontal="center" align="center">
          {showLock && (
            <Icon name="lock" size="xl" />
          )}
          <Heading variant="heading-strong-m" align="center">
            {title}
          </Heading>
          <Text onBackground="neutral-weak" variant="body-default-m" align="center">
            {description}
          </Text>
          <Button
            size="l"
            variant="primary"
            onClick={handleUnlock}
          >
            Unlock Now
          </Button>
          <Text onBackground="neutral-weak" variant="body-default-s" align="center">
            {lockerId
              ? `Locker ID: ${lockerId}`
              : "Replace this with your CPA Grip embed code"}
          </Text>
        </Column>
      </Card>
    </RevealFx>
  );
};
