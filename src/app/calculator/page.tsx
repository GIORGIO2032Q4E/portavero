"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { saveCloudEstimate } from "@/lib/auth";
import NumberField from "@/components/NumberField";
import { calculateImportCostSummary } from "@/lib/import-costs.mjs";

type Currency = "USD" | "EUR" | "GBP" | "GEL" | "JPY";
type CostKey = "purchase" | "supplier" | "inland" | "freight" | "insurance" | "customs" | "port" | "delivery" | "other";

type CostValues = Record<CostKey, number | null>;
type SavedEstimate = { id: number; name: string; savedAt: string; currency: Currency; category: string; origin: string; countryOfOrigin?: string; hsCode?: string; importDate?: string; destination: string; destinationPort: string; shippingMethod: string; quantity: number; costs: CostValues; dutyRate?: number | null; vatRate?: number | null };

const costFields: { key: CostKey; label: string; hint: string }[] = [
  { key: "purchase", label: "Purchase price", hint: "Price paid to the seller." },
  { key: "supplier", label: "Supplier or auction fees", hint: "Use the fee shown by the seller or auction house." },
  { key: "inland", label: "Origin inland transport", hint: "Transport to the export port or warehouse." },
  { key: "freight", label: "International freight", hint: "Use the price from your carrier's quote." },
  { key: "insurance", label: "Cargo insurance", hint: "Leave blank until confirmed if you do not know it." },
  { key: "customs", label: "Excise and other taxes (excluding duty/VAT)", hint: "Add any confirmed excise or other taxes here. Do not include the import duty or VAT/GST calculated below." },
  { key: "port", label: "Port and clearance charges", hint: "Destination handling, broker and documentation fees." },
  { key: "delivery", label: "Final delivery", hint: "Transport from the port to the final destination." },
  { key: "other", label: "Storage and other costs", hint: "Any additional known expense." }
];

const currencies: Currency[] = ["USD", "EUR", "GBP", "GEL", "JPY"];
const costKeys: CostKey[] = ["purchase", "supplier", "inland", "freight", "insurance", "customs", "port", "delivery", "other"];

function isNonNegativeAmount(value: unknown, currency: Currency): value is number | null {
  if (value === null) return true;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return false;
  const scale = currency === "JPY" ? 1 : 100;
  const scaled = value * scale;
  return Number.isFinite(scaled) &&
    scaled <= Number.MAX_SAFE_INTEGER &&
    Math.abs(scaled - Math.round(scaled)) <= 1e-7;
}

function isSavedEstimate(value: unknown): value is SavedEstimate {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const estimate = value as Record<string, unknown>;
  const costs = estimate.costs;
  if (!costs || typeof costs !== "object" || Array.isArray(costs)) return false;

  const costValues = costs as Record<string, unknown>;
  const validRate = (rate: unknown) =>
    rate === undefined || rate === null ||
    (typeof rate === "number" && Number.isFinite(rate) && rate >= 0 && rate <= 100 && Math.abs(rate * 100 - Math.round(rate * 100)) <= 1e-7);

  return Number.isSafeInteger(estimate.id) && Number(estimate.id) >= 0 &&
    typeof estimate.name === "string" && estimate.name.trim().length > 0 && estimate.name.length <= 60 &&
    typeof estimate.savedAt === "string" && Number.isFinite(Date.parse(estimate.savedAt)) &&
    typeof estimate.currency === "string" && currencies.includes(estimate.currency as Currency) &&
    typeof estimate.category === "string" &&
    typeof estimate.origin === "string" &&
    typeof estimate.destination === "string" &&
    typeof estimate.destinationPort === "string" &&
    typeof estimate.shippingMethod === "string" &&
    Number.isSafeInteger(estimate.quantity) && Number(estimate.quantity) >= 1 &&
    costKeys.every((key) => key in costValues && isNonNegativeAmount(costValues[key], estimate.currency as Currency)) &&
    ["countryOfOrigin", "hsCode", "importDate"].every((key) =>
      estimate[key] === undefined || typeof estimate[key] === "string"
    ) &&
    validRate(estimate.dutyRate) && validRate(estimate.vatRate);
}

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
  const [editingEstimateId, setEditingEstimateId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("portavero-saved-estimates");
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        setSaveMessage("I couldn't read the saved estimates in this browser.");
        return;
      }

      const validEstimates = parsed.filter(isSavedEstimate);
      setSavedEstimates(validEstimates.slice(0, 10));
      if (validEstimates.length !== parsed.length) {
        setSaveMessage("Some saved estimates could not be loaded because information was missing.");
      }
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
      setSaveMessage("Couldn't save this estimate. Check whether browser storage is available.");
      return false;
    }
  }

  async function saveEstimate() {
    const name = estimateName.trim();
    if (!name) {
      setSaveMessage("Give this estimate a name first.");
      return;
    }
    const isUpdating = editingEstimateId !== null;
    const snapshot: SavedEstimate = { id: editingEstimateId ?? Date.now(), name, savedAt: new Date().toISOString(), currency, category, origin, countryOfOrigin, hsCode, importDate, destination, destinationPort, shippingMethod, quantity, costs: { ...costs }, dutyRate, vatRate };
    const nextEstimates = isUpdating
      ? [snapshot, ...savedEstimates.filter((saved) => saved.id !== editingEstimateId)].slice(0, 10)
      : [snapshot, ...savedEstimates].slice(0, 10);
    const savedLocally = persistEstimates(nextEstimates);
    if (savedLocally) {
      setEditingEstimateId(null);
      setEstimateName("");
      setSaveMessage(isUpdating ? "Estimate updated in this browser." : "Estimate saved in this browser.");
    }

    if (isUpdating) return;

    try {
      const savedToAccount = await saveCloudEstimate(name, snapshot as unknown as Record<string, unknown>);
      if (savedToAccount) {
        if (!savedLocally) setEstimateName("");
        setSaveMessage(savedLocally
          ? "Estimate saved to your account and this browser."
          : "Estimate saved to your account. Browser storage was unavailable.");
      } else if (!savedLocally) {
        setSaveMessage("Couldn't save a browser copy. Sign in to save the estimate to your account.");
      }
    } catch {
      setSaveMessage(savedLocally
        ? "Saved in this browser, but account sync failed. Check your connection and try again."
        : "Could not save the estimate in the browser or account. Check storage and your connection, then try again.");
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
    setEditingEstimateId(saved.id);
    setEstimateName(saved.name);
    setSaveMessage(`Loaded “${saved.name}”. Edit the values, then save changes to update this entry.`);
  }

  function deleteEstimate(id: number) {
    persistEstimates(savedEstimates.filter((saved) => saved.id !== id));
    if (editingEstimateId === id) {
      setEditingEstimateId(null);
      setEstimateName("");
      setSaveMessage("Estimate deleted.");
    }
  }

  function cancelEstimateEdit() {
    setEditingEstimateId(null);
    setEstimateName("");
    setSaveMessage("Edit cancelled. Your changes were not saved.");
  }

  const result = useMemo(
    () => calculateImportCostSummary(costs, quantity, dutyRate, vatRate, currency),
    [costs, quantity, dutyRate, vatRate, currency]
  );

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
    setEditingEstimateId(null);
    setEstimateName("");
    setSaveMessage("The calculator has been reset. Your saved estimates are still there.");
  }

  function changeCurrency(nextCurrency: Currency) {
    if (nextCurrency === currency) return;
    setCurrency(nextCurrency);
    setCosts(emptyCosts);
  }

  return (
    <>
      <section className="page-hero calculator-hero">
        <div className="container">
          <span className="eyebrow">Import cost calculator</span>
          <h1>Add up the costs of an import.</h1>
          <p>Add the costs you know to see a running total. Leave unknown amounts blank and fill them in when you get a quote.</p>
        </div>
      </section>
      <section className="section calculator-page">
        <div className="container tool-layout">
          <section className="panel">
            <h2>Shipment details</h2>
            <p className="panel-intro">Use one currency for every amount. Portavero does not convert currencies or fetch live shipping prices.</p>
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
                <small>Changing the currency clears the amounts already entered, so they are not mistaken for a different currency.</small>
              </div>
              <div className="field">
                <label htmlFor="origin">Origin country or location</label>
                <input id="origin" value={origin} onChange={(event) => setOrigin(event.target.value)} maxLength={100} />
              </div>
              <div className="field">
                <label htmlFor="country-of-origin">Country of origin (where goods were made)</label>
                <input id="country-of-origin" value={countryOfOrigin} onChange={(event) => setCountryOfOrigin(event.target.value)} maxLength={100} />
                <small>The country where the goods were made can be different from the country you bought or shipped them from. It may affect the duty rate.</small>
              </div>
              <div className="field">
                <label htmlFor="hs-code">HS / tariff code</label>
                <input id="hs-code" value={hsCode} onChange={(event) => setHsCode(event.target.value)} maxLength={20} placeholder="e.g. 8703.23" />
                <small>Check the exact code with the destination customs authority before entering a tax rate.</small>
              </div>
              <div className="field">
                <label htmlFor="import-date">Expected import / declaration date</label>
                <input id="import-date" type="date" value={importDate} onChange={(event) => setImportDate(event.target.value)} />
                <small>This date is saved with the estimate. It does not look up old rates, and tax rules can change.</small>
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
              <NumberField inputMode="numeric" id="quantity" label="Number of items" value={quantity} step={1} min={1} onChange={(value) => setQuantity(value ?? 1)} hint="Enter a whole number. Portavero will also show the average cost per item." />
            </div>
            <h2 className="calculator-subheading">Tax rates you've checked</h2>
            <p className="panel-intro">First, check the rates for the product code, country of origin and destination. Then enter them here. Portavero does not look up or verify tax rates. Missing purchase, freight, insurance or other-tax costs can also make the estimate too low.</p>
            <div className="form-grid">
              <NumberField inputMode="decimal" id="duty-rate" label="Import duty rate (%)" value={dutyRate} min={0} max={100} onChange={setDutyRate} hint="Enter the rate for this exact product code and country of origin. Use a value from 0 to 100." />
              <NumberField inputMode="decimal" id="vat-rate" label="Import VAT / GST rate (%)" value={vatRate} min={0} max={100} onChange={setVatRate} hint="Enter a value from 0 to 100. Use 0 only when you've confirmed that the import is exempt or zero-rated." />
            </div>
            <div className="notice">
              <strong>Check the official tariff before you enter a rate.</strong>{" "}
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
            <h2 className="calculator-subheading">Costs you know</h2>
            <p className="panel-intro">Don't know an amount yet? Leave it blank. Enter 0 only when you've checked that the cost really is zero or does not apply.</p>
            <div className="form-grid">
              {costFields.map((field) => (
                <NumberField inputMode="decimal"
                  step={currency === "JPY" ? 1 : 0.01}
                  key={field.key}
                  id={field.key}
                  label={field.label}
                  value={costs[field.key]}
                  onChange={(value) => updateCost(field.key, value)}
                  hint={field.hint}
                />
              ))}
            </div>
            <div className="calculator-actions print-hide">
              <button type="button" className="button button-outline" onClick={resetCalculator}>Reset</button>
              <button type="button" className="button button-dark" onClick={() => window.print()}>Print or save as PDF</button>
            </div>
            <section className="saved-estimates print-hide">
              <h2>Save this estimate</h2>
              <p className="panel-intro">When you're signed out, saved estimates stay in this browser on this device. <Link href="/account" className="text-link">Sign in or create an account</Link> to save new estimates to your account. Loading an account estimate makes a copy in this browser. Changes to that copy do not update the saved account version.</p>
              <div className="estimate-save-controls">
                <input className="estimate-name-input" aria-label="Estimate name" placeholder="e.g. Car parts from Italy" value={estimateName} onChange={(event) => setEstimateName(event.target.value)} maxLength={60} />
                <button type="button" className="button button-dark" onClick={saveEstimate}>{editingEstimateId === null ? "Save estimate" : "Save changes"}</button>
                {editingEstimateId !== null && <button type="button" className="button button-outline" onClick={cancelEstimateEdit}>Cancel edit</button>}
              </div>
              {saveMessage && <p className="estimate-save-message" role="status">{saveMessage}</p>}
              {savedEstimates.length > 0 && <div className="saved-estimates-list">
                <h3>Saved in this browser ({savedEstimates.length}/10)</h3>
                {savedEstimates.map((saved) => <div key={saved.id} className="result-line saved-estimate-row">
                  <span><strong>{saved.name}</strong><br /><small>{new Date(saved.savedAt).toLocaleString()}</small></span>
                  <span className="saved-estimate-actions">
                    <button type="button" className="button button-outline" onClick={() => loadEstimate(saved)}>Load</button>
                    <button type="button" className="button button-outline" onClick={() => deleteEstimate(saved.id)} aria-label={`Delete ${saved.name}`}>Delete</button>
                  </span>
                </div>)}
              </div>}
            </section>
          </section>

          <aside className="panel result-panel" aria-live="polite">
            <span className="result-label">{dutyRate !== null && vatRate !== null ? "Estimated total with the rates you entered" : dutyRate !== null ? "Subtotal with your duty estimate" : "Subtotal of costs entered"}</span>
            <div className="result-total">{result.estimatedTotal === null ? "Check amounts" : money(result.estimatedTotal, currency)}</div>
            <p>{result.totalUnavailable ? "Something in the amounts is outside the calculator's safe range. Check the fields and reduce any unusually large values." : dutyRate !== null && vatRate !== null ? "This includes duty and VAT/GST calculated with the rates you entered. Check the tax base and local rules before using the figure." : dutyRate !== null ? "This includes your duty estimate, but not VAT/GST. Add both rates before using a combined tax estimate, and check the local tax rules." : vatRate !== null ? "VAT/GST needs the duty rate to calculate its tax base. Until you enter that rate, this is only the total of the costs you've entered." : "Add the duty and VAT/GST rates you've checked below to include a tax estimate. Until then, this is just the total of the costs you've entered."}</p>
            <div className="result-lines">
              {costFields.map(({ key, label }) => (
                <div className="result-line" key={key}>
                  <span>{label}</span>
                  <strong>{costs[key] === null ? "Not entered" : money(costs[key] ?? 0, currency)}</strong>
                </div>
              ))}
              <div className="result-line"><span>Costs used for customs value</span><strong>{result.customsValue === null ? "Check amounts" : money(result.customsValue, currency)}</strong></div>
              <div className="result-line"><span>Import duty {dutyRate === null ? "(rate missing)" : `(${dutyRate}%)`}</span><strong>{result.importDuty === null ? (dutyRate === null ? "Add a checked rate" : "Check amounts") : money(result.importDuty, currency)}</strong></div>
              <div className="result-line"><span>Import VAT / GST {vatRate === null ? "(rate missing)" : `(${vatRate}%)`}</span><strong>{result.importVat === null ? (dutyRate === null || vatRate === null ? "Add both tax rates" : "Check amounts") : money(result.importVat, currency)}</strong></div>
              <div className="result-line result-line-total">
                <span>Average cost per item</span>
                <strong>{result.perItem === null ? "Check amounts" : money(result.perItem, currency)}</strong>
              </div>
            </div>
            <div className="disclaimer">
              <strong>{result.unknownCosts.length} of {costFields.length} cost categories still need an amount.</strong>
              {result.unknownCosts.length > 0
                ? ` Still to add or check: ${result.unknownCosts.map((key) => costFields.find((field) => field.key === key)?.label.toLowerCase() ?? key).join(", ")}.`
                : " You have entered an amount for every cost category."} {result.missingCustomsValue > 0 ? `${result.missingCustomsValue} customs-value amounts are blank, so the tax estimate may be too low.` : ""} {dutyRate !== null && vatRate !== null && costs.customs === null ? " The VAT/GST estimate treats the blank excise/other-tax field as 0. It may be too low until you add the amount or confirm that it is zero." : ""} {dutyRate === null || vatRate === null ? "The full duty and VAT/GST estimate needs both rates." : "This is only an estimate. The destination country may use a different tax base, exemptions, thresholds, minimum charges or extra duties."}
            {result.totalUnavailable && <p className="calculator-footer-note">One or more amounts or rates are too large or invalid to calculate safely. Check the entries before relying on the estimate.</p>}
            </div>
            <p className="calculator-footer-note">
              Route: {origin.trim() || "Origin not specified"} → {destination.trim() || "Destination not specified"} · {destinationPort} · {shippingMethod}. Goods origin: {countryOfOrigin.trim() || "not specified"} · HS code: {hsCode.trim() || "not entered"} · import date: {importDate || "not entered"}. This calculator does not fetch shipping prices, convert currencies or look up tariffs. It uses the rates you enter, so check the final tax calculation with the destination country's customs authority.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
