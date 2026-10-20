"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { importCountries, vehicleCatalog } from "@/data/vehicle-catalog";

const revenueServiceUrl = "https://www.rs.ge/CarClearance-en";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GEL",
    maximumFractionDigits: 2
  }).format(value);

const enteredGroup = (values: Array<number | null>) =>
  values.every((value) => value === null)
    ? "Not entered"
    : money(values.reduce<number>((sum, value) => sum + (value ?? 0), 0));

function CostField({
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

export default function VehicleImportPage() {
  const [year, setYear] = useState(2020);
  const [makeName, setMakeName] = useState("");
  const [modelName, setModelName] = useState("");
  const [engineId, setEngineId] = useState("");
  const [sourceCountry, setSourceCountry] = useState("United States");
  const [engineCc, setEngineCc] = useState(2000);
  const [steering, setSteering] = useState("left");
  const [hybrid, setHybrid] = useState(false);
  const [purchase, setPurchase] = useState<number | null>(null);
  const [auction, setAuction] = useState<number | null>(null);
  const [inland, setInland] = useState<number | null>(null);
  const [shipping, setShipping] = useState<number | null>(null);
  const [insurance, setInsurance] = useState<number | null>(null);
  const [importDuty, setImportDuty] = useState<number | null>(null);
  const [port, setPort] = useState<number | null>(null);
  const [delivery, setDelivery] = useState<number | null>(null);

  const selectedMake = vehicleCatalog.find((make) => make.name === makeName);
  const selectedModel = selectedMake?.models.find((model) => model.name === modelName);
  const selectedEngine = selectedModel?.engines.find((engine) => engine.id === engineId);
  const isElectric = selectedEngine?.fuel === "Electric";

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  const eligibleYear = vehicleAge >= 0 && year <= currentYear;
  const validEngine = Number.isFinite(engineCc) && engineCc > 0;

  const result = useMemo(() => {
    const baseRate = vehicleAge <= 6 ? 1.5 : 4.5;
    let rate = baseRate;
    if (steering === "right") rate *= 3;
    else if (hybrid && vehicleAge >= 0 && vehicleAge <= 6) rate *= 0.4;
    const excise = eligibleYear && validEngine ? engineCc * rate : 0;
    const enteredCosts = [purchase, auction, inland, shipping, insurance, importDuty, port, delivery];
    const knownCosts = enteredCosts.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    const unknownCosts = enteredCosts.filter((value) => value === null).length;
    return { excise, knownCosts, unknownCosts, total: excise + knownCosts, rate };
  }, [vehicleAge, steering, hybrid, engineCc, eligibleYear, validEngine, purchase, auction, inland, shipping, insurance, importDuty, port, delivery]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Vehicle import planner</span>
          <h1>Estimate the cost of importing a car.</h1>
          <p>Enter your car details and known costs to get a preliminary excise estimate for Georgia. Check the result with the official Revenue Service calculator.</p>
          <div className="hero-actions">
            <a href={revenueServiceUrl} target="_blank" rel="noreferrer" className="button button-outline">Open official Revenue Service calculator ↗</a>
            <Link href="/how-it-works" className="button button-dark">How estimates work</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container tool-layout">
          <section className="panel vehicle-panel">
            <div className="vehicle-section-heading"><span className="step-chip">01</span><div><span className="eyebrow">Start with the car</span><h2>Identify your vehicle</h2></div></div>
            <p className="panel-intro">This estimate uses a limited set of rules for passenger vehicles classified under HS 8703. Check the official calculator if you are unsure about your vehicle.</p>
            <div className="notice"><strong>Electric vehicles:</strong> This estimator does not calculate the special excise rule for fully electric vehicles. Use the official Revenue Service calculator for electric vehicles and any vehicle with uncertain classification or transitional status.</div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="source-country">Country of purchase</label>
                <select id="source-country" value={sourceCountry} onChange={(event) => setSourceCountry(event.target.value)}>
                  {importCountries.map((country) => <option key={country} value={country}>{country}</option>)}
                </select>
                <small>Where the vehicle is bought, not necessarily where it was built.</small>
              </div>
              <div className="field">
                <label htmlFor="make">Make</label>
                <select id="make" value={makeName} onChange={(event) => { setMakeName(event.target.value); setModelName(""); setEngineId(""); }}>
                  <option value="">Choose a make</option>
                  {vehicleCatalog.map((make) => <option key={make.name} value={make.name}>{make.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="model">Model</label>
                <select id="model" value={modelName} disabled={!selectedMake} onChange={(event) => { setModelName(event.target.value); setEngineId(""); }}>
                  <option value="">Choose a model</option>
                  {selectedMake?.models.map((model) => <option key={model.name} value={model.name}>{model.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="engine-variant">Engine / powertrain</label>
                <select id="engine-variant" value={engineId} disabled={!selectedModel} onChange={(event) => {
                  const id = event.target.value;
                  setEngineId(id);
                  const engine = selectedModel?.engines.find((item) => item.id === id);
                  if (engine) {
                    setEngineCc(engine.cc);
                    setHybrid(engine.fuel === "Hybrid" || engine.fuel === "Plug-in hybrid");
                  }
                }}>
                  <option value="">Choose an engine variant</option>
                  {selectedModel?.engines.map((engine) => <option key={engine.id} value={engine.id}>{engine.label} · {engine.cc ? engine.cc.toLocaleString("en-US") + " cm³" : "EV"}</option>)}
                </select>
                <small>{selectedEngine ? `${selectedEngine.fuel} · ${selectedEngine.years}` : "Variants are a starting guide; confirm the exact engine code."}</small>
              </div>
              <div className="field">
                <label htmlFor="manufacture-year">Manufacture year</label>
                <select id="manufacture-year" value={year} onChange={(event) => setYear(Number(event.target.value))}>
                  {Array.from({ length: currentYear - 1960 + 1 }, (_, index) => currentYear - index).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <CostField id="engine-cc" label="Engine capacity (cm³)" value={engineCc} onChange={(value) => { setEngineCc(Math.round(value ?? 0)); setEngineId(""); }} hint="Auto-filled from a selected variant. Edit to match the vehicle documents." />
              <div className="field">
                <label htmlFor="steering">Steering configuration</label>
                <select id="steering" value={steering} onChange={(event) => setSteering(event.target.value)}>
                  <option value="left">Left-hand drive</option>
                  <option value="right">Right-hand drive or converted</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="hybrid">Vehicle type</label>
                <select id="hybrid" value={hybrid ? "hybrid" : "other"} onChange={(event) => setHybrid(event.target.value === "hybrid")}>
                  <option value="other">Non-hybrid</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <small>The published 60% reduction applies to left-hand-drive hybrids aged 0–6 years inclusive.</small>
              </div>
            </div>
            {(!eligibleYear || !validEngine || isElectric) && <div className="notice" role="alert">{isElectric ? "This selected vehicle is electric. This estimator does not calculate electric-vehicle tax treatment. Use the official Revenue Service calculator." : "Check the manufacture year and engine capacity before using this estimate."}</div>}
            <div className="notice">
              <strong>Rate used:</strong> {money(result.rate)} per cm³. {makeName && modelName && selectedEngine ? `${makeName} ${modelName} · ${selectedEngine.label} · purchase/shipping country: ${sourceCountry}.` : "Choose a vehicle variant if available, or enter the engine capacity manually."} The catalogue lists common variants only, not every year/market configuration. Verify your exact vehicle documents and use the official calculator for a final check.
            </div>
          </section>

          <aside className="panel result-panel" aria-live="polite">
            <span className="result-label">Preliminary excise estimate</span>
            <div className="result-total">{eligibleYear && validEngine && !isElectric ? money(result.excise) : "Check details"}</div>
            <p>{eligibleYear && validEngine && !isElectric ? `${year} model year · ${vehicleAge} year(s) old · ${engineCc.toLocaleString("en-US")} cm³` : "Enter valid details and verify special cases."}</p>
            <div className="result-lines">
              <div className="result-line"><span>Excise rate</span><strong>{isElectric ? "Not calculated" : `${money(result.rate)} / cm³`}</strong></div>
              <div className="result-line"><span>Purchase and auction</span><strong>{enteredGroup([purchase, auction])}</strong></div>
              <div className="result-line"><span>Transport and insurance</span><strong>{enteredGroup([inland, shipping, insurance])}</strong></div>
              <div className="result-line"><span>Import duty entered by you</span><strong>{importDuty === null ? "Not entered" : money(importDuty)}</strong></div>
              <div className="result-line"><span>Port and local delivery</span><strong>{enteredGroup([port, delivery])}</strong></div>
              <div className="result-line"><span>Other entered costs subtotal</span><strong>{money(result.knownCosts)}</strong></div>
              <div className="result-line result-line-total"><span>{isElectric ? "Known costs subtotal only" : "Known costs + estimated excise"}</span><strong>{isElectric ? money(result.knownCosts) : money(result.total)}</strong></div>
            </div>
            <div className="disclaimer"><strong>{result.unknownCosts} of 8 cost categories still unknown.</strong> {isElectric ? "Electric-vehicle taxes are not calculated here. The amount shown is only the sum of costs you entered, excluding tax." : result.unknownCosts > 0 ? "The displayed budget excludes blank costs, so it is not a final landed-cost total." : "All additional cost fields have an entered amount. Confirm applicable taxes and fees with official sources."} Import duty and service charges are not calculated here. The excise figure is preliminary.</div>
          </aside>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Your known costs</span>
            <h2>Add the rest of the journey.</h2>
            <p>Enter confirmed amounts in GEL. Convert foreign-currency quotes using an exchange rate you have verified. Leave unknown charges blank so the planner does not mistake them for free.</p>
          </div>
          <div className="panel">
            <div className="form-grid">
              <CostField id="purchase" label="Vehicle purchase price (GEL)" value={purchase} onChange={setPurchase} />
              <CostField id="auction" label="Auction / buyer fees (GEL)" value={auction} onChange={setAuction} />
              <CostField id="inland" label="Origin inland transport (GEL)" value={inland} onChange={setInland} />
              <CostField id="shipping" label="International shipping (GEL)" value={shipping} onChange={setShipping} />
              <CostField id="insurance" label="Insurance (GEL)" value={insurance} onChange={setInsurance} />
              <CostField id="import-duty" label="Import duty (GEL)" value={importDuty} onChange={setImportDuty} hint="Enter the amount confirmed by the official calculator or a customs professional." />
              <CostField id="port" label="Port, broker and storage (GEL)" value={port} onChange={setPort} />
              <CostField id="delivery" label="Local delivery / registration (GEL)" value={delivery} onChange={setDelivery} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-narrow prose">
          <h2>Important rules and verification</h2>
          <p>The Georgian Revenue Service announced a changed excise model effective April 2, 2026. Its published summary states a rate of GEL 1.50 per cm³ for passenger vehicles aged up to and including six years, and GEL 4.50 per cm³ for older vehicles. Right-hand-drive or converted vehicles use three times the applicable rate. For left-hand-drive hybrids aged up to and including six years, the rate is reduced by 60%. The catalog is a practical starting list of common variants, not an official complete database: engine sizes and available powertrains can change by model year, trim and destination market.</p>
          <p>Some vehicles may qualify for transitional treatment based on registration or transport documentation dated before April 2, 2026. The formula here does not decide whether those exceptions apply. It also does not calculate import duty, service fees, VAT treatment for unusual classifications, or special cases.</p>
          <p><strong>Before bidding or shipping, verify the exact vehicle in the official <a href={revenueServiceUrl} target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a>.</strong> If the vehicle&apos;s classification or transitional status is unclear, contact the Revenue Service.</p>
          <p>Source: <a href="https://voice.rs.ge/Default.aspx?id=3874" target="_blank" rel="noreferrer">Revenue Service notice on the April 2, 2026 tax-code change</a>. This estimate is informational, not a binding customs assessment.</p>
        </div>
      </section>
    </>
  );
}
