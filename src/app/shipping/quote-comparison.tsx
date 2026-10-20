"use client";

import { useMemo, useState } from "react";

type Quote = { provider: string; price: string; currency: "USD" | "EUR" | "GEL"; days: string; insurance: boolean };

const blankQuote = (): Quote => ({ provider: "", price: "", currency: "USD", days: "", insurance: false });

export default function QuoteComparison() {
  const [quotes, setQuotes] = useState<Quote[]>([blankQuote(), blankQuote(), blankQuote()]);
  const validQuotes = useMemo(() => quotes
    .map((quote, index) => ({ ...quote, index, amount: Number(quote.price), transitDays: Number(quote.days) }))
    .filter((quote) => quote.provider.trim() && quote.price.trim() && Number.isFinite(quote.amount) && quote.amount >= 0), [quotes]);

  function updateQuote(index: number, changes: Partial<Quote>) {
    setQuotes((current) => current.map((quote, i) => i === index ? { ...quote, ...changes } : quote));
  }

  const bestByCurrency = (currency: Quote["currency"]) => validQuotes
    .filter((quote) => quote.currency === currency)
    .sort((a, b) => a.amount - b.amount)[0];

  return (
    <section className="section section-tint" id="quote-comparison">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Manual quote comparison</span>
          <h2>Compare quotes you already have.</h2>
          <p>Enter offers received from shipping providers. Portavero does not fetch live prices, contact providers, or verify these offers. Compare only prices in the same currency.</p>
        </div>
        <div className="panel">
          <div className="form-grid">
            {quotes.map((quote, index) => (
              <section key={index} className="quote-entry" style={{ border: "1px solid var(--border, #ddd)", padding: 16, borderRadius: 8 }}>
                <h3>Quote {index + 1}</h3>
                <div className="field">
                  <label htmlFor={`quote-provider-${index}`}>Provider name</label>
                  <input id={`quote-provider-${index}`} value={quote.provider} maxLength={80} onChange={(event) => updateQuote(index, { provider: event.target.value })} placeholder="Company or agent" />
                </div>
                <div className="field">
                  <label htmlFor={`quote-price-${index}`}>Quoted price</label>
                  <input id={`quote-price-${index}`} type="number" min="0" step="0.01" value={quote.price} onChange={(event) => updateQuote(index, { price: event.target.value })} placeholder="Enter amount" />
                </div>
                <div className="field">
                  <label htmlFor={`quote-currency-${index}`}>Currency</label>
                  <select id={`quote-currency-${index}`} value={quote.currency} onChange={(event) => updateQuote(index, { currency: event.target.value as Quote["currency"] })}>
                    <option value="USD">USD</option><option value="EUR">EUR</option><option value="GEL">GEL</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor={`quote-days-${index}`}>Estimated transit days (optional)</label>
                  <input id={`quote-days-${index}`} type="number" min="0" step="1" value={quote.days} onChange={(event) => updateQuote(index, { days: event.target.value })} placeholder="e.g. 24" />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                  <input type="checkbox" checked={quote.insurance} onChange={(event) => updateQuote(index, { insurance: event.target.checked })} />
                  Insurance included in quote
                </label>
              </section>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <h3>Comparison</h3>
            {validQuotes.length === 0 ? <p>Enter a provider name and a price to compare a quote.</p> : (
              <div className="result-lines">
                {validQuotes.map((quote) => (
                  <div className="result-line" key={quote.index}>
                    <span><strong>{quote.provider}</strong><br /><small>{quote.days.trim() ? `About ${quote.days} transit days` : "Transit time not entered"} · {quote.insurance ? "Insurance marked as included" : "Insurance not marked as included"}</small></span>
                    <strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: quote.currency, maximumFractionDigits: 2 }).format(quote.amount)}</strong>
                  </div>
                ))}
              </div>
            )}
            {(["USD", "EUR", "GEL"] as const).map((currency) => {
              const best = bestByCurrency(currency);
              return best ? <p key={currency} style={{ marginTop: 10 }}>Lowest entered {currency} quote: <strong>{best.provider}</strong> ({new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(best.amount)}).</p> : null;
            })}
            <p className="disclaimer" style={{ marginTop: 18 }}>The lowest price is not always the best offer. Check what is included, quote expiry, cargo limits, insurance terms, destination charges and delivery before choosing a provider. This comparison stays in the current page and is not saved.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
