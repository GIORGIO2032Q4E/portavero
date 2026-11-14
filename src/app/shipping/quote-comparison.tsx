"use client";

import { useMemo, useState } from "react";

type Quote = { provider: string; price: string; currency: "USD" | "EUR" | "GEL"; days: string; insurance: boolean };

const blankQuote = (): Quote => ({ provider: "", price: "", currency: "USD", days: "", insurance: false });

function hasValidTransitDays(value: string) {
  return !value.trim() || (Number.isInteger(Number(value)) && Number(value) >= 0);
}

export default function QuoteComparison() {
  const [quotes, setQuotes] = useState<Quote[]>([blankQuote(), blankQuote(), blankQuote()]);
  const validQuotes = useMemo(() => quotes
    .map((quote, index) => ({ ...quote, index, amount: Number(quote.price) }))
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
          <span className="eyebrow">Compare your shipping quotes</span>
          <h2>Put the quotes you've received side by side.</h2>
          <p>Add the prices and details from the offers you have received. Portavero does not contact shipping companies or check whether a quote is genuine. Compare prices in the same currency.</p>
        </div>
        <div className="panel">
          <div className="form-grid">
            {quotes.map((quote, index) => (
              <section key={index} className="quote-entry">
                <h3>Quote {index + 1}</h3>
                <div className="field">
                  <label htmlFor={`quote-provider-${index}`}>e.g. Company or agent</label>
                  <input id={`quote-provider-${index}`} value={quote.provider} maxLength={80} onChange={(event) => updateQuote(index, { provider: event.target.value })} placeholder="Company or agent" />
                </div>
                <div className="field">
                  <label htmlFor={`quote-price-${index}`}>Price in the quote</label>
                  <input id={`quote-price-${index}`} type="number" min="0" step="0.01" value={quote.price} onChange={(event) => updateQuote(index, { price: event.target.value })} placeholder="Enter amount" />
                </div>
                <div className="field">
                  <label htmlFor={`quote-currency-${index}`}>Currency</label>
                  <select id={`quote-currency-${index}`} value={quote.currency} onChange={(event) => updateQuote(index, { currency: event.target.value as Quote["currency"] })}>
                    <option value="USD">USD</option><option value="EUR">EUR</option><option value="GEL">GEL</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor={`quote-days-${index}`}>Estimated travel time in days (optional)</label>
                  <input
                    id={`quote-days-${index}`}
                    type="number"
                    min="0"
                    step="1"
                    value={quote.days}
                    onChange={(event) => updateQuote(index, { days: event.target.value })}
                    placeholder="e.g. 24"
                    aria-invalid={!hasValidTransitDays(quote.days)}
                    aria-describedby={quote.days.trim() && !hasValidTransitDays(quote.days) ? `quote-days-error-${index}` : undefined}
                  />
                  {quote.days.trim() && !hasValidTransitDays(quote.days) && (
                    <small id={`quote-days-error-${index}`} className="field-error">
                      Enter a whole number of days greater than or equal to zero.
                    </small>
                  )}
                </div>
                <label className="quote-insurance">
                  <input type="checkbox" checked={quote.insurance} onChange={(event) => updateQuote(index, { insurance: event.target.checked })} />
                  Insurance included in quote
                </label>
              </section>
            ))}
          </div>
          <div className="quote-comparison-results">
            <h3>Comparison</h3>
            {validQuotes.length === 0 ? <p>Add a company name and price to see the quote here.</p> : (
              <div className="result-lines">
                {validQuotes.map((quote) => (
                  <div className="result-line" key={quote.index}>
                    <span><strong>{quote.provider.trim()}</strong><br /><small>{quote.days.trim() && hasValidTransitDays(quote.days) ? `About ${Number(quote.days)} transit days` : "Travel time not entered"} · {quote.insurance ? "Insurance listed as included" : "Insurance not listed as included"}</small></span>
                    <strong>{new Intl.NumberFormat("en-US", { style: "currency", currency: quote.currency, maximumFractionDigits: 2 }).format(quote.amount)}</strong>
                  </div>
                ))}
              </div>
            )}
            {(["USD", "EUR", "GEL"] as const).map((currency) => {
              const best = bestByCurrency(currency);
              return best ? <p key={currency} className="quote-best-price">Lowest {currency} price you entered: <strong>{best.provider}</strong> ({new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(best.amount)}).</p> : null;
            })}
            <p className="disclaimer quote-disclaimer">The cheapest quote is not always the best deal. Check what it covers, when it expires, cargo limits, insurance, destination charges and final delivery. These entries stay on this page and are cleared when you leave.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
