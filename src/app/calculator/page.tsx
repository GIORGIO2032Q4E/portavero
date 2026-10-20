"use client";

import { useEffect, useMemo, useState } from "react";

type Currency = "USD" | "EUR" | "GBP" | "GEL" | "JPY";
type CostKey = "purchase" | "supplier" | "inland" | "freight" | "insurance" | "customs" | "port" | "delivery" | "other";

type CostValues = Record<CostKey, number | null>;
type SavedEstimate = { id: number; name: string; savedAt: string; currency: Currency; category: string; origin: string; destination: string; destinationPort: string; shippingMethod: string; quantity: number; costs: CostValues };

const costFields: { key: CostKey; label: string; hint: string }[] = [
  { key: "purchase", label: "Purchase price", hint: "Price paid to the seller." },
  { key: "supplier", label: "Supplier or auction fees", hint: "Enter the fee shown by the seller or auction." },
  { key: "inland", label: "Origin inland transport", hint: "Transport to the export port or warehouse." },
  { key: "freight", label: "International freight", hint: "Use a carrier quote where possible." },
  { key: "insurance", label: "Cargo insurance", hint: "Leave blank until confirmed if you do not know it." },
  { key: "customs", label: "Customs duties and taxes", hint: "Enter a verified estimate from an official source or professional." },
  { key: "port", label: "Port and clearance charges", hint: "Destination handling, broker and documentation fees." },
  { key: "delivery", label: "Final delivery", hint: "Transport from the port to the final destination." },
  { key: "other", label: "Storage and other costs", hint: "Any additional known expense." }
];

const emptyCosts: CostValues = {
  purchase: null,
  supplier: null,
  inland: null,
  freight: null,
  insurance: null,
  customs: null,
  port: null,
  delivery: null,
  other: null
};

function money(value: number, currency: Currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2
  }).format(value);
}

function NumberField({
  id,
  label,
  value,
  onChange,
  hint
}: {
  id: string;
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  hint?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === "") {
            onChange(null);
            return;
          }
          const parsed = Number(raw);
          onChange(Number.isFinite(parsed) && parsed >= 0 ? parsed : null);
        }}
      />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function CalculatorPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [category, setCategory] = useState("Vehicle");
  const [origin, setOrigin] = useState("United States");
  const [destination, setDestination] = useState("Georgia");
  const [destinationPort, setDestinationPort] = useState("Poti");
  const [shippingMethod, setShippingMethod] = useState("Ocean freight");
  const [quantity, setQuantity] = useState(1);
  const [costs, setCosts] = useState<CostValues>(emptyCosts);
  const [estimateName, setEstimateName] = useState("");
  const [savedEstimates, setSavedEstimates] = useState<SavedEstimate[]>([]);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("portavero-saved-estimates");
      if (stored) setSavedEstimates(JSON.parse(stored) as SavedEstimate[]);
    } catch {
      setSaveMessage("Saved estimates could not be read in this browser.");
    }
  }, []);

  function persistEstimates(next: SavedEstimate[]) {
    setSavedEstimates(next);
    try {
      localStorage.setItem("portavero-saved-estimates", JSON.stringify(next));
      setSaveMessage("");
    } catch {
      setSaveMessage("Could not save in this browser. Check available storage.");
    }
  }

  function saveEstimate() {
    const name = estimateName.trim();
    if (!name) {
      setSaveMessage("Enter a name for this estimate first.");
      return;
    }
    const snapshot: SavedEstimate = { id: Date.now(), name, savedAt: new Date().toISOString(), currency, category, origin, destination, destinationPort, shippingMethod, quantity, costs: { ...costs } };
    persistEstimates([snapshot, ...savedEstimates].slice(0, 10));
    setEstimateName("");
    setSaveMessage("Estimate saved in this browser.");
  }

  function loadEstimate(saved: SavedEstimate) {
    setCurrency(saved.currency);
    setCategory(saved.category);
    setOrigin(saved.origin);
    setDestination(saved.destination);
    setDestinationPort(saved.destinationPort);
    setShippingMethod(saved.shippingMethod);
    setQuantity(saved.quantity);
    setCosts(saved.costs);
    setSaveMessage(`Loaded “${saved.name}”.`);
  }

  function deleteEstimate(id: number) {
    persistEstimates(savedEstimates.filter((saved) => saved.id !== id));
  }

  const result = useMemo(() => {
    const enteredCosts = costFields.filter(({ key }) => costs[key] !== null);
    const knownSubtotal = enteredCosts.reduce((sum, { key }) => sum + (costs[key] ?? 0), 0);
    const unknownCosts = costFields.filter(({ key }) => costs[key] === null);
    return {
      knownSubtotal,
      unknownCosts,
      enteredCount: enteredCosts.length,
      perItem: quantity > 0 ? knownSubtotal / quantity : knownSubtotal
    };
  }, [costs, quantity]);

  function updateCost(key: CostKey, value: number | null) {
    setCosts((current) => ({ ...current, [key]: value }));
  }

  function resetCalculator() {
    setCurrency("USD");
    setCategory("Vehicle");
    setOrigin("United States");
    setDestination("Georgia");
    setDestinationPort("Poti");
    setShippingMethod("Ocean freight");
    setQuantity(1);
    setCosts(emptyCosts);
  }

  function changeCurrency(nextCurrency: Currency) {
    if (nextCurrency === currency) return;
    setCurrency(nextCurrency);
    setCosts(emptyCosts);
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Import cost calculator</span>
          <h1>Estimate your import costs.</h1>
          <p>Enter the amounts you know to get a subtotal. Leave anything unknown blank and add it later when you have a quote.</p>
        </div>
      </section>
      <section className="section">
        <div className="container tool-layout">
          <section className="panel">
            <h2>Shipment details</h2>
            <p className="panel-intro">Use the same currency for every amount. Currency conversion and live shipping prices are not connected.</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="category">What are you importing?</label>
                <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option>Vehicle</option>
                  <option>Motorcycle</option>
                  <option>Electronics</option>
                  <option>Machinery</option>
                  <option>General cargo</option>
                  <option>Other goods</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="currency">Calculation currency</label>
                <select id="currency" value={currency} onChange={(event) => changeCurrency(event.target.value as Currency)}>
                  <option value="USD">USD · US dollar</option>
                  <option value="EUR">EUR · Euro</option>
                  <option value="GBP">GBP · British pound</option>
                  <option value="GEL">GEL · Georgian lari</option>
                  <option value="JPY">JPY · Japanese yen</option>
                </select>
                <small>Changing currency clears amounts so they are not accidentally relabelled.</small>
              </div>
              <div className="field">
                <label htmlFor="origin">Origin country or location</label>
                <input id="origin" value={origin} onChange={(event) => setOrigin(event.target.value)} maxLength={100} />
              </div>
              <div className="field">
                <label htmlFor="destination">Destination country</label>
                <input id="destination" value={destination} onChange={(event) => setDestination(event.target.value)} maxLength={100} />
              </div>
              <div className="field">
                <label htmlFor="port">Destination port or terminal</label>
                <select id="port" value={destinationPort} onChange={(event) => setDestinationPort(event.target.value)}>
                  <option value="Poti">Poti, Georgia</option>
                  <option value="Batumi">Batumi, Georgia</option>
                  <option value="Other">Other / not selected</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="shipping-method">Shipping method</label>
                <select id="shipping-method" value={shippingMethod} onChange={(event) => setShippingMethod(event.target.value)}>
                  <option>Ocean freight</option>
                  <option>Air freight</option>
                  <option>Road transport</option>
                  <option>Rail freight</option>
                  <option>Not decided</option>
                </select>
              </div>
              <NumberField id="quantity" label="Number of items" value={quantity} onChange={(value) => setQuantity(Math.max(1, Math.round(value ?? 1)))} hint="Used to calculate the average cost per item." />
            </div>
            <h2 style={{ marginTop: 34 }}>Known costs</h2>
            <p className="panel-intro">Leave a field blank if you do not know the amount yet. Enter 0 only when you have confirmed that the cost is zero or does not apply.</p>
            <div className="form-grid">
              {costFields.map((field) => (
                <NumberField
                  key={field.key}
                  id={field.key}
                  label={field.label}
                  value={costs[field.key]}
                  onChange={(value) => updateCost(field.key, value)}
                  hint={field.hint}
                />
              ))}
            </div>
            <div className="calculator-actions print-hide" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              <button type="button" className="button button-outline" onClick={resetCalculator}>Reset calculator</button>
              <button type="button" className="button button-dark" onClick={() => window.print()}>Print / Save as PDF</button>
            </div>
            <section className="saved-estimates print-hide" style={{ marginTop: 30, borderTop: "1px solid var(--border, #ddd)", paddingTop: 22 }}>
              <h2>Save this estimate</h2>
              <p className="panel-intro">Saved estimates stay in this browser on this device. They are not uploaded to an account or synced across devices.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input aria-label="Estimate name" placeholder="e.g. Car parts from Italy" value={estimateName} onChange={(event) => setEstimateName(event.target.value)} maxLength={60} style={{ flex: "1 1 220px" }} />
                <button type="button" className="button button-dark" onClick={saveEstimate}>Save estimate</button>
              </div>
              {saveMessage && <p role="status" style={{ marginTop: 10 }}>{saveMessage}</p>}
              {savedEstimates.length > 0 && <div style={{ marginTop: 18 }}>
                <h3>Saved in this browser ({savedEstimates.length}/10)</h3>
                {savedEstimates.map((saved) => <div key={saved.id} className="result-line" style={{ gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <span><strong>{saved.name}</strong><br /><small>{new Date(saved.savedAt).toLocaleString()}</small></span>
                  <span style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                    <button type="button" className="button button-outline" onClick={() => loadEstimate(saved)}>Load</button>
                    <button type="button" className="button button-outline" onClick={() => deleteEstimate(saved.id)} aria-label={`Delete ${saved.name}`}>Delete</button>
                  </span>
                </div>)}
              </div>}
            </section>
          </section>

          <aside className="panel result-panel" aria-live="polite">
            <span className="result-label">Known-cost subtotal</span>
            <div className="result-total">{money(result.knownSubtotal, currency)}</div>
            <p>This is the sum of the amounts entered, not a guaranteed final landed cost.</p>
            <div className="result-lines">
              {costFields.map(({ key, label }) => (
                <div className="result-line" key={key}>
                  <span>{label}</span>
                  <strong>{costs[key] === null ? "Not entered" : money(costs[key] ?? 0, currency)}</strong>
                </div>
              ))}
              <div className="result-line result-line-total">
                <span>Average per item</span>
                <strong>{money(result.perItem, currency)}</strong>
              </div>
            </div>
            <div className="disclaimer">
              <strong>{result.unknownCosts.length} of {costFields.length} cost categories still unknown.</strong>
              {result.unknownCosts.length > 0
                ? ` Add or verify: ${result.unknownCosts.map(({ label }) => label.toLowerCase()).join(", ")}.`
                : " All listed categories have an entered amount. Verify applicable taxes and fees with official sources before relying on the total."}
            </div>
            <p style={{ marginTop: 18, fontSize: ".78rem" }}>
              Route: {origin.trim() || "Origin not specified"} → {destination.trim() || "Destination not specified"} · {destinationPort} · {shippingMethod}. No live freight rates, currency conversion, or automatic customs assessment is connected.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
