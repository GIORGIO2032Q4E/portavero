"use client";

import { useCallback, useEffect, useState } from "react";
import { convertUsdGel } from "@/lib/currency.mjs";

type Direction = "USD_TO_GEL" | "GEL_TO_USD";
type ExchangeRate = {
  rate: number;
  rateDate: string;
  source: string;
};

function isExchangeRate(value: unknown): value is ExchangeRate {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return typeof data.rate === "number" &&
    Number.isFinite(data.rate) &&
    data.rate > 0 &&
    typeof data.rateDate === "string" &&
    typeof data.source === "string";
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatRate(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(value);
}

function formatRateDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export default function CurrencyConverter() {
  const [direction, setDirection] = useState<Direction>("USD_TO_GEL");
  const [amount, setAmount] = useState("100");
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRate = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/exchange-rate", { cache: "no-store" });
      const payload: unknown = await response.json();

      if (!response.ok || !isExchangeRate(payload)) {
        const message = payload && typeof payload === "object" &&
          "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Could not load the official USD exchange rate.";
        throw new Error(message);
      }

      setExchangeRate(payload);
    } catch (loadError) {
      setError(loadError instanceof Error
        ? loadError.message
        : "Could not load the official USD exchange rate.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRate();
  }, [loadRate]);

  const fromCurrency = direction === "USD_TO_GEL" ? "USD" : "GEL";
  const toCurrency = direction === "USD_TO_GEL" ? "GEL" : "USD";
  const fromSymbol = direction === "USD_TO_GEL" ? "$" : "₾";
  const toSymbol = direction === "USD_TO_GEL" ? "₾" : "$";
  const parsedAmount = amount.trim() === "" ? null : Number(amount.trim().replace(",", "."));
  const validAmount = parsedAmount !== null && Number.isFinite(parsedAmount) && parsedAmount >= 0;
  const converted = exchangeRate && validAmount
    ? convertUsdGel(parsedAmount, exchangeRate.rate, direction)
    : null;

  function switchDirection() {
    setDirection((current) => current === "USD_TO_GEL" ? "GEL_TO_USD" : "USD_TO_GEL");
  }

  return (
    <section className="section">
      <div className="container currency-layout">
        <section className="panel currency-panel">
          <div className="currency-heading">
            <span className="step-chip" aria-hidden="true">↔</span>
            <div>
              <span className="eyebrow">Live conversion</span>
              <h2>Convert an amount</h2>
            </div>
          </div>

          <div className="currency-amount-card">
            <div className="currency-card-label">
              <span>You have</span>
              <strong>{fromCurrency}</strong>
            </div>
            <div className="currency-amount-input">
              <span aria-hidden="true">{fromSymbol}</span>
              <label className="currency-visually-hidden" htmlFor="currency-amount">Amount in {fromCurrency}</label>
              <input
                id="currency-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                aria-describedby="currency-amount-help"
              />
            </div>
          </div>

          <button
            type="button"
            className="currency-swap"
            onClick={switchDirection}
            aria-label={`Switch from ${fromCurrency} to ${toCurrency}`}
          >
            <span aria-hidden="true">⇅</span>
            Switch to {toCurrency} → {fromCurrency}
          </button>

          <div className="currency-amount-card currency-output-card" aria-live="polite">
            <div className="currency-card-label">
              <span>You get</span>
              <strong>{toCurrency}</strong>
            </div>
            <div className="currency-output-amount">
              <span aria-hidden="true">{toSymbol}</span>
              <strong>
                {loading && !exchangeRate
                  ? "Loading…"
                  : converted === null
                    ? "—"
                    : formatAmount(converted)}
              </strong>
            </div>
          </div>

          <p id="currency-amount-help" className="currency-helper">
            {amount.trim() !== "" && !validAmount
              ? "Enter a valid amount greater than or equal to zero."
              : "Change the amount or switch direction. The result updates automatically."}
          </p>
          {error && <div className="notice currency-error" role="alert">{error}</div>}
          {!exchangeRate && error && (
            <button type="button" className="button button-outline currency-retry" onClick={() => void loadRate()} disabled={loading}>
              Try again
            </button>
          )}
        </section>

        <aside className="panel result-panel currency-rate-panel">
          <span className="result-label">Official reference rate</span>
          <div className="currency-rate-pair">
            {exchangeRate ? formatRate(exchangeRate.rate) : loading ? "…" : "Unavailable"}
          </div>
          <p>Georgian lari for 1 US dollar</p>
          <div className="currency-rate-detail">
            <span>1 USD</span>
            <strong>{exchangeRate ? `${formatRate(exchangeRate.rate)} GEL` : "—"}</strong>
          </div>
          <div className="currency-rate-detail">
            <span>1 GEL</span>
            <strong>{exchangeRate ? `${formatRate(1 / exchangeRate.rate)} USD` : "—"}</strong>
          </div>
          <div className="currency-rate-date">
            <span>Rate date</span>
            <strong>{exchangeRate ? formatRateDate(exchangeRate.rateDate) : "—"}</strong>
          </div>
          <div className="disclaimer">
            This is the National Bank of Georgia’s official reference rate, not a bank’s cash or card rate. The amount you receive at an exchange office or bank may be different.
          </div>
          <a
            className="currency-source-link"
            href="https://nbg.gov.ge/en/monetary-policy/currency"
            target="_blank"
            rel="noreferrer"
          >
            View the rate at the National Bank of Georgia ↗
          </a>
          {loading && <p className="currency-loading" role="status">Updating the exchange rate…</p>}
        </aside>
      </div>
    </section>
  );
}
