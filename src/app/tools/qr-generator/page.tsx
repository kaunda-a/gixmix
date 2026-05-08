"use client";

import { useState, useCallback, useRef } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Input,
  Card,
  Select,
} from "@once-ui-system/core";
import QRCode from "qrcode";

type ErrorCorrection = "L" | "M" | "Q" | "H";

const errorCorrectionOptions = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

export default function QRGeneratorPage() {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrection>("M");
  const [color, setColor] = useState("#000000");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = useCallback(async () => {
    if (!text.trim()) {
      setError("Please enter text or a URL");
      return;
    }

    try {
      setError(null);
      const url = await QRCode.toDataURL(text.trim(), {
        width: 400,
        margin: 2,
        color: {
          dark: color,
          light: "#ffffff",
        },
        errorCorrectionLevel: errorCorrection,
      });
      setQrDataUrl(url);
    } catch (e) {
      setError("Failed to generate QR code");
    }
  }, [text, color, errorCorrection]);

  const download = useCallback((format: "png") => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qrcode.${format}`;
    link.href = qrDataUrl;
    link.click();
  }, [qrDataUrl]);

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        QR Code Generator
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Generate QR codes from text or URLs. Download as PNG.
      </Text>

      <Card
        fillWidth
        padding="l"
        radius="m"
        border="neutral-alpha-weak"
        background="page"
      >
        <Column gap="m">
          <Input
            id="qr-text"
            label="Text or URL"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
          />

          <Row gap="m" wrap={true} vertical="end">
            <Flex flex={1}>
              <Select
                id="error-correction"
                label="Error Correction"
                options={errorCorrectionOptions}
                value={errorCorrection}
                onSelect={(value) => setErrorCorrection(value as ErrorCorrection)}
              />
            </Flex>
            <Flex flex={1}>
              <Input
                id="color"
                label="Color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Flex>
          </Row>

          <Flex fillWidth horizontal="center">
            <Button size="l" variant="primary" onClick={generateQR}>
              Generate QR Code
            </Button>
          </Flex>
        </Column>
      </Card>

      {error && (
        <Text onBackground="danger-weak">{error}</Text>
      )}

      {qrDataUrl && (
        <Card
          fillWidth
          padding="l"
          radius="m"
          border="neutral-alpha-weak"
          background="page"
        >
          <Column gap="m" horizontal="center" align="center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Generated QR Code"
              style={{ maxWidth: "300px", height: "auto" }}
            />
            <Row gap="m">
              <Button size="m" variant="primary" onClick={() => download("png")}>
                Download PNG
              </Button>
            </Row>
          </Column>
        </Card>
      )}
    </Column>
  );
}
