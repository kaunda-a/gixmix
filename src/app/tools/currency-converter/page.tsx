"use client";

import { useState, useEffect, useCallback } from "react";

interface RateData {
  [key: string]: number;
}

// currency-api - free, no key required, reliable
const API_BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
];

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState<string | null>(null);
  const [rates, setRates] = useState<RateData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [amount2, setAmount2] = useState("");
  const [fromCurrency2, setFromCurrency2] = useState("EUR");
  const [toCurrency2, setToCurrency2] = useState("USD");
  const [result2, setResult2] = useState<string | null>(null);

  const fetchRates = useCallback(async (base: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${base.toLowerCase()}.json`);
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data = await res.json();
      const rawRates = data[base.toLowerCase()];
      if (rawRates) {
        const parsed: RateData = {};
        for (const [key, val] of Object.entries(rawRates)) {
          parsed[key.toUpperCase()] = val as number;
        }
        parsed[base] = 1;
        setRates(parsed);
        setLastUpdated(new Date().toLocaleString());
      } else {
        throw new Error("API returned invalid data");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch exchange rates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates(fromCurrency);
  }, [fromCurrency, fetchRates]);

  const convert = useCallback(() => {
    const val = parseFloat(amount);
    if (isNaN(val)) { setResult("Enter a valid number"); return; }
    if (!rates[toCurrency]) { setResult("Rate unavailable"); return; }
    const converted = val * rates[toCurrency];
    setResult(`${val.toLocaleString()} ${fromCurrency} = ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`);
  }, [amount, fromCurrency, toCurrency, rates]);

  const swap = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 0" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: "0.5rem" }}>
        Currency Converter
      </h1>
      <p style={{ textAlign: "center", color: "var(--neutral-on-background-weak)", marginBottom: "0.25rem" }}>
        Convert between 170+ currencies using real-time exchange rates
      </p>
      <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--neutral-on-background-weak)", marginBottom: "2rem" }}>
        Powered by currency-api (free, no API key required)
      </p>

      <div style={{
        border: "1px solid var(--neutral-border-medium)", borderRadius: "12px",
        padding: "1.5rem", background: "var(--neutral-surface)", marginBottom: "1.5rem"
      }}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--neutral-border-medium)", fontSize: "1rem", background: "var(--neutral-surface)", color: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>From</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--neutral-border-medium)", fontSize: "1rem", background: "var(--neutral-surface)", color: "inherit" }}>
              {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <button onClick={swap}
            style={{ padding: "0.5rem 1rem", borderRadius: "50%", border: "1px solid var(--neutral-border-medium)", background: "var(--neutral-surface)", cursor: "pointer", fontSize: "1.25rem" }}>
            ⇅
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>To</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--neutral-border-medium)", fontSize: "1rem", background: "var(--neutral-surface)", color: "inherit" }}>
              {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "120px", display: "flex", alignItems: "flex-end" }}>
            <button onClick={convert} disabled={loading}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "none", fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", background: "var(--brand-background-strong)", color: "var(--brand-on-background-strong)", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Loading..." : "Convert"}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ padding: "1rem", borderRadius: "8px", background: "var(--brand-alpha-weak)", textAlign: "center" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--neutral-on-background-weak)", marginBottom: "0.25rem" }}>Result:</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{result}</p>
          </div>
        )}

        {error && <p style={{ color: "var(--danger-on-background-weak)", marginTop: "0.5rem" }}>{error}</p>}

        {lastUpdated && (
          <p style={{ fontSize: "0.75rem", color: "var(--neutral-on-background-weak)", marginTop: "0.75rem", textAlign: "center" }}>
            Rates updated: {lastUpdated}
          </p>
        )}
      </div>

      <div style={{
        border: "1px solid var(--neutral-border-medium)", borderRadius: "12px",
        padding: "1.5rem", background: "var(--neutral-surface)"
      }}>
        <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Popular Rates</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.5rem" }}>
          {["EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR"].map(code => {
            const rate = rates[code];
            return (
              <div key={code} style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", background: "var(--brand-alpha-weak)" }}>
                <strong>1 {fromCurrency}</strong>
                <p style={{ fontSize: "0.9rem" }}>= {rate ? rate.toFixed(4) : "..."} {code}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
