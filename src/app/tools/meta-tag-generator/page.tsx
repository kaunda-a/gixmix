"use client";

import { useState } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Input,
  Card,
  Icon,
  Textarea,
} from "@once-ui-system/core";
import { ContentLocker } from "@/components/monetization/content-locker";

interface MetaFields {
  title: string;
  description: string;
  url: string;
  siteName: string;
  ogImage: string;
  twitterHandle: string;
}

interface BulkEntry {
  title: string;
  description: string;
  url: string;
}

function generateMetaTags(fields: MetaFields): string {
  const tags = [
    `<title>${escapeHtml(fields.title)}</title>`,
    `<meta name="description" content="${escapeHtml(fields.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(fields.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(fields.description)}" />`,
  ];
  if (fields.url) tags.push(`<meta property="og:url" content="${escapeHtml(fields.url)}" />`);
  if (fields.siteName) tags.push(`<meta property="og:site_name" content="${escapeHtml(fields.siteName)}" />`);
  if (fields.ogImage) tags.push(`<meta property="og:image" content="${escapeHtml(fields.ogImage)}" />`);
  if (fields.twitterHandle) {
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    tags.push(`<meta name="twitter:site" content="${escapeHtml(fields.twitterHandle)}" />`);
    tags.push(`<meta name="twitter:title" content="${escapeHtml(fields.title)}" />`);
    tags.push(`<meta name="twitter:description" content="${escapeHtml(fields.description)}" />`);
  }
  return tags.join("\n");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generateBulkTags(entries: BulkEntry[]): string {
  return entries.map((e, i) =>
    `<!-- Page ${i + 1}: ${escapeHtml(e.title)} -->\n${generateMetaTags({
      title: e.title,
      description: e.description,
      url: e.url,
      siteName: "",
      ogImage: "",
      twitterHandle: "",
    })}`
  ).join("\n\n");
}

function generateSchema(fields: MetaFields): string {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fields.title,
    description: fields.description,
  };
  if (fields.url) schema.url = fields.url;
  return JSON.stringify(schema, null, 2);
}

export default function MetaTagGeneratorPage() {
  const [fields, setFields] = useState<MetaFields>({
    title: "",
    description: "",
    url: "",
    siteName: "",
    ogImage: "",
    twitterHandle: "",
  });
  const [generated, setGenerated] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [bulkGenerated, setBulkGenerated] = useState("");
  const [showSchema, setShowSchema] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const updateField = (key: keyof MetaFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    if (!fields.title || !fields.description) return;
    setGenerated(generateMetaTags(fields));
  };

  const handleBulkGenerate = () => {
    try {
      const parsed: BulkEntry[] = JSON.parse(bulkInput);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        alert("Enter a JSON array with at least one entry. See the format hint below.");
        return;
      }
      setBulkGenerated(generateBulkTags(parsed));
    } catch {
      alert("Invalid JSON format. Check the example below.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        SEO Meta Tag Generator
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Generate optimized meta tags, Open Graph tags, and Twitter cards for your web pages
      </Text>

      <Card fillWidth padding="l" radius="m" border="neutral-alpha-weak" background="page">
        <Column gap="m">
          <Input
            id="mt-title"
            label="Page Title"
            value={fields.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="My Amazing Page Title | Brand Name"
          />
          <Textarea
            id="mt-desc"
            label="Meta Description"
            value={fields.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="A compelling description of your page content..."
            rows={3}
          />
          <Input
            id="mt-url"
            label="Page URL (optional)"
            value={fields.url}
            onChange={(e) => updateField("url", e.target.value)}
            placeholder="https://example.com/page"
          />
          <Input
            id="mt-site"
            label="Site Name (optional)"
            value={fields.siteName}
            onChange={(e) => updateField("siteName", e.target.value)}
            placeholder="My Website"
          />
          <Input
            id="mt-ogimage"
            label="OG Image URL (optional)"
            value={fields.ogImage}
            onChange={(e) => updateField("ogImage", e.target.value)}
            placeholder="https://example.com/og-image.jpg"
          />
          <Input
            id="mt-twitter"
            label="Twitter Handle (optional)"
            value={fields.twitterHandle}
            onChange={(e) => updateField("twitterHandle", e.target.value)}
            placeholder="@mybrand"
          />

          <Flex fillWidth horizontal="end">
            <Button size="l" variant="primary" onClick={handleGenerate} disabled={!fields.title || !fields.description}>
              Generate Meta Tags
            </Button>
          </Flex>
        </Column>
      </Card>

      {generated && (
        <Card fillWidth padding="l" radius="m" border="success-alpha-weak" background="page">
          <Column gap="m">
            <Row horizontal="between" vertical="center" fillWidth>
              <Row gap="8" vertical="center">
                <Icon name="shield" size="l" />
                <Heading as="h2" variant="heading-strong-m">
                  Your Meta Tags
                </Heading>
              </Row>
              <Button size="s" variant="tertiary" onClick={() => handleCopy(generated)}>
                Copy
              </Button>
            </Row>
            <pre
              style={{
                background: "var(--surface-background-medium)",
                padding: "1rem",
                borderRadius: "var(--radius-s)",
                fontSize: "0.85rem",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {generated}
            </pre>
          </Column>
        </Card>
      )}

      <ContentLocker
        title="Unlock Advanced Features"
        description="Complete a quick offer to access bulk generation, schema markup, and keyword optimization"
      >
        <Column gap="m">
          <Card fillWidth padding="l" radius="m" border="success-alpha-weak" background="page">
            <Column gap="m">
              <Row gap="8" vertical="center">
                <Icon name="document" size="l" />
                <Heading as="h2" variant="heading-strong-m">
                  Schema Markup (JSON-LD)
                </Heading>
              </Row>
              {!showSchema ? (
                <Button size="m" variant="secondary" onClick={() => setShowSchema(true)}>
                  Generate Schema
                </Button>
              ) : (
                <>
                  <pre
                    style={{
                      background: "var(--surface-background-medium)",
                      padding: "1rem",
                      borderRadius: "var(--radius-s)",
                      fontSize: "0.85rem",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    }}
                  >
                    {generateSchema(fields)}
                  </pre>
                  <Button size="s" variant="tertiary" onClick={() => handleCopy(generateSchema(fields))}>
                    Copy Schema
                  </Button>
                </>
              )}
            </Column>
          </Card>

          <Card fillWidth padding="l" radius="m" border="success-alpha-weak" background="page">
            <Column gap="m">
              <Row gap="8" vertical="center">
                <Icon name="data" size="l" />
                <Heading as="h2" variant="heading-strong-m">
                  Bulk Generation (10+ Pages)
                </Heading>
              </Row>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Enter a JSON array of pages. Example:
              </Text>
              <pre style={{ fontSize: "0.8rem", background: "var(--surface-background-medium)", padding: "0.5rem", borderRadius: "var(--radius-s)" }}>
{`[
  {"title": "Page 1", "description": "Desc 1", "url": "https://.../page1"},
  {"title": "Page 2", "description": "Desc 2", "url": "https://.../page2"}
]`}
              </pre>
              <Textarea
                id="mt-bulk"
                label="Bulk JSON Input"
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder='[{&quot;title&quot;: &quot;...&quot;, &quot;description&quot;: &quot;...&quot;, &quot;url&quot;: &quot;...&quot;}]'
                rows={5}
              />
              <Button size="m" variant="secondary" onClick={handleBulkGenerate}>
                Generate Bulk Tags
              </Button>
              {bulkGenerated && (
                <>
                  <pre
                    style={{
                      background: "var(--surface-background-medium)",
                      padding: "1rem",
                      borderRadius: "var(--radius-s)",
                      fontSize: "0.85rem",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-all",
                    }}
                  >
                    {bulkGenerated}
                  </pre>
                  <Button size="s" variant="tertiary" onClick={() => handleCopy(bulkGenerated)}>
                    Copy All Tags
                  </Button>
                </>
              )}
            </Column>
          </Card>
        </Column>
      </ContentLocker>
    </Column>
  );
}
