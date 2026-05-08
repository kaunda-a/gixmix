"use client";

import { useState } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Card,
} from "@once-ui-system/core";

interface UserData {
  name: { title: string; first: string; last: string };
  email: string;
  phone: string;
  cell: string;
  gender: string;
  location: {
    street: { number: number; name: string };
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  dob: { date: string; age: number };
  picture: { large: string; medium: string; thumbnail: string };
  login: { username: string };
  nat: string;
}

export default function RandomUserPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateUser = async () => {
    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const res = await fetch("https://randomuser.me/api/");
      if (!res.ok) throw new Error("Failed to generate user");
      const data = await res.json();
      setUser(data.results[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate user");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Random User Generator
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Generate random user profiles for testing and development
      </Text>
      <Text onBackground="neutral-weak" variant="body-default-s" align="center">
        Powered by randomuser.me (free, no API key required)
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page" horizontal="center">
        <Button size="l" variant="primary" onClick={generateUser} disabled={loading}>
          {loading ? "Generating..." : "Generate Random User"}
        </Button>
      </Card>

      {error && (
        <Text variant="body-default-s" onBackground="danger-weak">
          {error}
        </Text>
      )}

      {user && (
        <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
          <Column gap="l">
            <Row gap="l" vertical="center" wrap={true}>
              <img
                src={user.picture.large}
                alt={`${user.name.first} ${user.name.last}`}
                style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
              />
              <Column gap="4">
                <Heading as="h2" variant="heading-strong-m">
                  {user.name.title} {user.name.first} {user.name.last}
                </Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                  @{user.login.username}
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak" style={{ textTransform: "capitalize" }}>
                  {user.gender} &middot; {user.dob.age} years old &middot; {user.nat}
                </Text>
              </Column>
            </Row>

            <Row gap="m" fillWidth wrap={true}>
              <Flex flex={1}>
                <Column gap="4">
                  <Text variant="body-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Email
                  </Text>
                  <Text variant="body-default-m" style={{ wordBreak: "break-all" }}>{user.email}</Text>
                </Column>
              </Flex>
              <Flex flex={1}>
                <Column gap="4">
                  <Text variant="body-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Phone
                  </Text>
                  <Text variant="body-default-m">{user.phone}</Text>
                </Column>
              </Flex>
              <Flex flex={1}>
                <Column gap="4">
                  <Text variant="body-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Cell
                  </Text>
                  <Text variant="body-default-m">{user.cell}</Text>
                </Column>
              </Flex>
              <Flex flex={1}>
                <Column gap="4">
                  <Text variant="body-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Date of Birth
                  </Text>
                  <Text variant="body-default-m">{formatDate(user.dob.date)}</Text>
                </Column>
              </Flex>
            </Row>

            <Column gap="4">
              <Text variant="body-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Location
              </Text>
              <Text variant="body-default-m">
                {user.location.street.number} {user.location.street.name}, {user.location.city}, {user.location.state}, {user.location.country} ({user.location.postcode})
              </Text>
            </Column>
          </Column>
        </Card>
      )}
    </Column>
  );
}
