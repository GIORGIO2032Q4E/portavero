"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { saveCloudEstimate } from "@/lib/auth";
import NumberField from "@/components/NumberField";

type Currency = "USD" | "EUR" | "GBP" | "GEL" | "JPY";
type CostKey = "purchase" | "supplier" | "inland" | "freight" | "insurance" | "customs" | "port" | "delivery" | "other";

type CostValues = Record<CostKey, number | null>;
type SavedEstimate = { id: number; name: string; savedAt: string; currency: Currency; category: string; origin: string; countryOfOrigin?: string; hsCode?: string; importDate?: string; destination: string; destinationPort: string; shippingMethod: string; quantity: number; costs: CostValues; dutyRate?: number | null; vatRate?: number | null };

const costFields: { key: CostKey; label: string; hint: string }[] = [
  { key: "purchase", label: "Purchase price", hint: "Price paid to the seller." },
  { key: "supplier", label: "Supplier or auction fees", hint: "Enter the fee shown by the seller or auction." },
  { key: "inland", label: "Origin inland transport", hint: "Transport to the export port or warehouse." },
  { key: "freight", label: "International freight", hint: "Use a carrier quote where possible." },
  { key: "insurance", label: "Cargo insurance", hint: "Leave blank until confirmed if you do not know it." },
  { key: "customs", label: "Excise and other taxes (excluding duty/VAT)", hint: "Enter verified excise or other taxes here. Do not include the import duty or VAT calculated below." },
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

export default function CalculatorPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [category, setCategory] = useState("Vehicle");
  const [origin, setOrigin] = useState("United States");
  const [countryOfOrigin, setCountryOfOrigin] = useState("United States");
  const [hsCode, setHsCode] = useState("");
  const [importDate, setImportDate] = useState("");
  const [destination, setDestination] = useState("Georgia");
  const [destinationPort, setDestinationPort] = useState("Poti");
  const [shippingMethod, setShippingMethod] = useState("Ocean freight");
  const [quantity, setQuantity] = useState(1);
  const [dutyRate, setDutyRate] = useState<number | null>(null);
  const [vatRate, setVatRate] = useState<number | null>(null);
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

  function persistEstimates(next: SavedEstimate[]): boolean {
    try {
      localStorage.setItem("portavero-saved-estimates", JSON.stringify(next));
      setSavedEstimates(next);
      setSaveMessage("");
      return true;
    } catch {
      setSaveMessage("Could not save in this browser. Check available storage.");
      return false;
    }
  }

  async function saveEstimate() {
    const name = estimateName.trim();
    if (!name) {
      setSaveMessage("Enter a name for this estimate first.");
      return;
    }
    const snapshot: SavedEstimate = { id: Date.now(), name, savedAt: new Date().toISOString(), currency, category, origin, countryOfOrigin, hsCode, importDate, destination, destinationPort, shippingMethod, quantity, costs: { ...costs }, dutyRate, vatRate };
    if (!persistEstimates([snapshot, ...savedEstimates].slice(0, 10))) return;
    setEstimateName("");
    setSaveMessage("Estimate saved in this browser.");
    try {
      const savedToAccount = await saveCloudEstimate(name, snapshot as unknown as Record<string, unknown>);
      if (savedToAccount) setSaveMessage("Estimate saved to your account and this browser.");
    } catch {
      setSaveMessage("Saved in this browser, but account sync failed. Check your connection and try again.");
    }
  }

  function loadEstimate(saved: SavedEstimate) {
    setCurrency(saved.currency);
    setCategory(saved.category);
    setOrigin(saved.origin);
    setCountryOfOrigin(saved.countryOfOrigin ?? saved.origin);
    setHsCode(saved.hsCode ?? "");
    setImportDate(saved.importDate ?? "");
    setDestination(saved.destination);
    setDestinationPort(saved.destinationPort);
    setShippingMethod(saved.shippingMethod);
    setQuantity(saved.quantity);
    setCosts(saved.costs);
    setDutyRate(saved.dutyRate ?? null);
    setVatRate(saved.vatRate ?? null);
    setSaveMessage(`Loaded “${saved.name}”.`);
  }

  function deleteEstimate(id: number) {
    persistEstimates(savedEstimates.filter((saved) => saved.id !== id));
  }

  const result = useMemo(() => {
    const enteredCosts = costFields.filter(({ key }) => costs[key] !== null);
    const knownSubtotal = enteredCosts.reduce((sum, { key }) => sum + (costs[key] ?? 0), 0);
    const unknownCosts = costFields.filter(({ key }) => costs[key] === null);
    const customsValueKeys: CostKey[] = ["purchase", "supplier", "inland", "freight", "insurance"];
    const customsValue = customsValueKeys.reduce((sum, key) => sum + (costs[key] ?? 0), 0);
    const missingCustomsValue = customsValueKeys.filter((key) => costs[key] === null).length;
    const importDuty = dutyRate === null ? null : customsValue * dutyRate / 100;
    const importVat = dutyRate === null || vatRate === null
      ? null
      : (customsValue + (importDuty ?? 0) + (costs.customs ?? 0)) * vatRate / 100;
    const estimatedTotal = knownSubtotal + (importDuty ?? 0) + (importVat ?? 0);
    return {
      knownSubtotal,
      unknownCosts,
      enteredCount: enteredCosts.length,
      customsValue,
      missingCustomsValue,
      importDuty,
      importVat,
      estimatedTotal,
      perItem: quantity > 0 ? estimatedTotal / quantity : estimatedTotal
    };
  }, [costs, quantity, dutyRate, vatRate]);

  function updateCost(key: CostKey, value: number | null) {
    setCosts((current) => ({ ...current, [key]: value }));
  }

  function resetCalculator() {
    setCurrency("USD");
    setCategory("Vehicle");
    setOrigin("United States");
    setCountryOfOrigin("United States");
    setHsCode("");
    setImportDate("");
    setDestination("Georgia");
    setDestinationPort("Poti");
    setShippingMethod("Ocean freight");
    setQuantity(1);
    setCosts(emptyCosts);
    setDutyRate(null);
    setVatRate(null);
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
                <label htmlFor="country-of-origin">Country of origin (where goods were made)</label>
                <input id="country-of-origin" value={countryOfOrigin} onChange={(event) => setCountryOfOrigin(event.target.value)} maxLength={100} />
                <small>Origin can differ from the country you buy or ship the goods from and may affect preferential duty.</small>
              </div>
              <div className="field">
                <label htmlFor="hs-code">HS / tariff code</label>
                <input id="hs-code" value={hsCode} onChange={(event) => setHsCode(event.target.value)} maxLength={20} placeholder="e.g. 8703.23" />
                <small>Use the destination customs authority’s exact code before selecting a rate.</small>
              </div>
              <div className="field">
                <label htmlFor="import-date">Expected import / declaration date</label>
                <input id="import-date" type="date" value={importDate} onChange={(event) => setImportDate(event.target.value)} />
                <small>Rates and exemptions can change over time. This date is recorded for your reference; it does not fetch historical rates.</small>
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
              <NumberField inputMode="decimal" id="quantity" label="Number of items" value={quantity} onChange={(value) => setQuantity(Math.max(1, Math.round(value ?? 1)))} hint="Used to calculate the average cost per item." />
            </div>
            <h2 style={{ marginTop: 34 }}>Verified tax rates</h2>
            <p className="panel-intro">Enter rates confirmed for the destination country and product classification. Rates are not fetched automatically. The estimates use the customs-value costs entered above, so missing purchase, freight or insurance amounts can make the result too low.</p>
            <div className="form-grid">
              <NumberField inputMode="decimal" id="duty-rate" label="Import duty rate (%)" value={dutyRate} onChange={(value) => setDutyRate(value === null ? null : Math.min(100, value))} hint="Use the rate for the exact HS / tariff code and origin rules." />
              <NumberField inputMode="decimal" id="vat-rate" label="Import VAT / GST rate (%)" value={vatRate} onChange={(value) => setVatRate(value === null ? null : Math.min(100, value))} hint="Enter 0 only if the applicable import is confirmed to be exempt or zero-rated." />
            </div>
            <div className="notice">
              <strong>Check the official tariff before entering rates.</strong>{" "}
              {destination.trim().toLowerCase() === "georgia" ? (
                <a href="https://www.rs.ge/CommodityCodes-en" target="_blank" rel="noreferrer">Georgia Revenue Service tariff and commodity codes ↗</a>
              ) : /^(eu|european union|germany|france|italy|spain|netherlands|poland|ireland|belgium|austria|portugal|greece|finland|sweden|denmark|czechia|czech republic|romania|bulgaria|croatia|slovakia|slovenia|hungary|lithuania|latvia|estonia|luxembourg|cyprus|malta)$/i.test(destination.trim()) ? (
                <a href="https://taxation-customs.ec.europa.eu/online-services/online-services-and-databases-customs/eu-customs-tariff-taric_en" target="_blank" rel="noreferrer">European Commission TARIC tariff database ↗</a>
              ) : /^(uk|united kingdom|great britain|england|scotland|wales|northern ireland)$/i.test(destination.trim()) ? (
                <a href="https://www.gov.uk/trade-tariff" target="_blank" rel="noreferrer">UK Trade Tariff: commodity codes and duty ↗</a>
              ) : /^(us|usa|united states|united states of america)$/i.test(destination.trim()) ? (
                <a href="https://hts.usitc.gov/" target="_blank" rel="noreferrer">United States Harmonized Tariff Schedule ↗</a>
              ) : (
                <a href="https://www.wcoomd.org/en/topics/nomenclature/resources/national-and-international-customs-tariff/national-tariff" target="_blank" rel="noreferrer">WCO directory of national customs tariffs ↗</a>
              )}. Check rates for destination: {destination.trim() || "not specified"}; tariff code: {hsCode.trim() || "not entered"}; origin: {countryOfOrigin.trim() || "not specified"}; import date: {importDate || "not entered"}. This tool does not fetch tariff rates automatically. EU TARIC does not include national VAT rates, and special taxes or exemptions may require separate checks.
            </div>
            <h2 style={{ marginTop: 34 }}>Known costs</h2>
            <p className="panel-intro">Leave a field blank if you do not know the amount yet. Enter 0 only when you have confirmed that the cost is zero or does not apply.</p>
            <div className="form-grid">
              {costFields.map((field) => (
                <NumberField inputMode="decimal"
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
              <p className="panel-intro">Saved estimates stay in this browser on this device when you are signed out. <Link href="/account" className="text-link">Sign in or create an account</Link> to sync new estimates across devices.</p>
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
            <span className="result-label">{dutyRate !== null && vatRate !== null ? "Estimated total using entered rates" : dutyRate !== null ? "Subtotal including entered duty estimate" : "Known-cost subtotal"}</span>
            <div className="result-total">{money(result.estimatedTotal, currency)}</div>
            <p>{dutyRate !== null && vatRate !== null ? "Includes estimated duty and VAT/GST using the rates you entered. Confirm the tax base and any country-specific rules before relying on it." : dutyRate !== null ? "Includes the duty estimate from your entered rate, but excludes VAT/GST until both rates are available. Confirm the tax base and country-specific rules." : vatRate !== null ? "VAT/GST cannot be estimated yet because the duty rate needed for its tax base is missing. The displayed amount is only your entered costs." : "Enter verified duty and VAT/GST rates below to add a preliminary tax estimate. Until then, this is only the sum of entered costs."}</p>
            <div className="result-lines">
              {costFields.map(({ key, label }) => (
                <div className="result-line" key={key}>
                  <span>{label}</span>
                  <strong>{costs[key] === null ? "Not entered" : money(costs[key] ?? 0, currency)}</strong>
                </div>
              ))}
              <div className="result-line"><span>Customs-value costs entered</span><strong>{money(result.customsValue, currency)}</strong></div>
              <div className="result-line"><span>Import duty {dutyRate === null ? "(rate missing)" : `(${dutyRate}%)`}</span><strong>{result.importDuty === null ? "Enter verified rate" : money(result.importDuty, currency)}</strong></div>
              <div className="result-line"><span>Import VAT / GST {vatRate === null ? "(rate missing)" : `(${vatRate}%)`}</span><strong>{result.importVat === null ? "Enter both duty and VAT/GST rates" : money(result.importVat, currency)}</strong></div>
              <div className="result-line result-line-total">
                <span>Average per item</span>
                <strong>{money(result.perItem, currency)}</strong>
              </div>
            </div>
            <div className="disclaimer">
              <strong>{result.unknownCosts.length} of {costFields.length} cost categories still unknown.</strong>
              {result.unknownCosts.length > 0
                ? ` Add or verify: ${result.unknownCosts.map(({ label }) => label.toLowerCase()).join(", ")}.`
                : " All listed cost categories have an entered amount."} {result.missingCustomsValue > 0 ? `${result.missingCustomsValue} customs-value inputs are blank, so the tax base may be understated.` : ""} {dutyRate === null || vatRate === null ? "Duty and VAT/GST are not fully calculated until both verified rates are entered." : "These are indicative calculations. Local law may use a different tax base, exemptions, thresholds, minimum charges or special duties."}
            </div>
            <p style={{ marginTop: 18, fontSize: ".78rem" }}>
              Route: {origin.trim() || "Origin not specified"} → {destination.trim() || "Destination not specified"} · {destinationPort} · {shippingMethod}. Goods origin: {countryOfOrigin.trim() || "not specified"} · HS code: {hsCode.trim() || "not entered"} · import date: {importDate || "not entered"}. No live freight rates, currency conversion or automatic tariff lookup is connected. This calculator applies the rates you enter and does not replace the destination country’s official customs calculation.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
