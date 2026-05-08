"use client";

import { useState } from "react";

export default function URLShortenerPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    try {
      new URL(normalizedUrl);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);
    setError(null);
    setShortUrl(null);

    try {
      // Use is.gd API (free, no key required, supports CORS)
      const apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(normalizedUrl)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.errorcode) {
        throw new Error(data.errormessage || "Failed to shorten URL");
      }

      setShortUrl(data.shorturl);
    } catch (e) {
      // Fallback to tinyurl
      try {
        const apiUrl2 = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(normalizedUrl)}`;
        const response2 = await fetch(apiUrl2);
        const short = await response2.text();
        if (short && !short.includes("Error")) {
          setShortUrl(short);
          return;
        }
      } catch {}
      setError(e instanceof Error ? e.message : "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 0" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: "0.5rem" }}>
        URL Shortener
      </h1>
      <p style={{ textAlign: "center", color: "var(--neutral-on-background-weak)", marginBottom: "0.25rem" }}>
        Shorten any URL instantly — free, no signup required
      </p>
      <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--neutral-on-background-weak)", marginBottom: "2rem" }}>
        Powered by is.gd &amp; TinyURL (free APIs)
      </p>

      <div style={{
        border: "1px solid var(--neutral-border-medium)", borderRadius: "12px",
        padding: "1.5rem", background: "var(--neutral-surface)", marginBottom: "1.5rem"
      }}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
            Enter a long URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            style={{
              width: "100%", padding: "0.75rem", borderRadius: "8px",
              border: "1px solid var(--neutral-border-medium)", fontSize: "1rem",
              background: "var(--neutral-surface)", color: "inherit", boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleShorten}
          disabled={loading}
          style={{
            width: "100%", padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none",
            fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            background: "var(--brand-background-strong)", color: "var(--brand-on-background-strong)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </div>

      {error && (
        <div style={{
          border: "1px solid var(--danger-border-medium)", borderRadius: "12px",
          padding: "1rem", marginBottom: "1.5rem", color: "var(--danger-on-background-weak)",
        }}>
          {error}
        </div>
      )}

      {shortUrl && (
        <div style={{
          border: "1px solid var(--neutral-border-medium)", borderRadius: "12px",
          padding: "1.5rem", background: "var(--neutral-surface)", marginBottom: "1.5rem",
        }}>
          <p style={{ fontSize: "0.85rem", color: "var(--neutral-on-background-weak)", marginBottom: "0.5rem" }}>
            Your shortened URL:
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, padding: "0.75rem", borderRadius: "8px",
                border: "1px solid var(--neutral-border-medium)",
                fontSize: "1.1rem", fontWeight: 600, textDecoration: "none",
                color: "var(--brand-on-background-strong)", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {shortUrl}
            </a>
            <button
              onClick={copyToClipboard}
              style={{
                padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--neutral-border-medium)",
                background: "var(--neutral-surface)", cursor: "pointer", fontWeight: 500,
                color: copied ? "var(--success-on-background-weak)" : "inherit",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div style={{
        border: "1px solid var(--neutral-border-medium)", borderRadius: "12px",
        padding: "1.5rem", background: "var(--neutral-surface)"
      }}>
        <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Features</h3>
        <ul style={{ lineHeight: "1.8", paddingLeft: "1.25rem", color: "var(--neutral-on-background-weak)" }}>
          <li>Free — no API key or signup required</li>
          <li>Short URLs never expire</li>
          <li>Works with any URL</li>
          <li>Powered by is.gd with TinyURL fallback</li>
        </ul>
      </div>
    </div>
  );
}
