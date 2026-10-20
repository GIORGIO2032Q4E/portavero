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
  const [classicCar, setClassicCar] = useState(false);
  const [purchase, setPurchase] = useState<number | null>(null);
  const [auction, setAuction] = useState<number | null>(null);
  const [inland, setInland] = useState<number | null>(null);
  const [shipping, setShipping] = useState<number | null>(null);
  const [insurance, setInsurance] = useState<number | null>(null);
  const [port, setPort] = useState<number | null>(null);
  const [delivery, setDelivery] = useState<number | null>(null);

  const selectedMake = vehicleCatalog.find((make) => make.name === makeName);
  const selectedModel = selectedMake?.models.find((model) => model.name === modelName);
  const selectedEngine = selectedModel?.engines.find((engine) => engine.id === engineId);
  const isElectric = selectedEngine?.fuel === "Electric";

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  const eligibleYear = vehicleAge >= 0 && year <= currentYear;
  const validEngine = isElectric || (Number.isFinite(engineCc) && engineCc > 0);

  const result = useMemo(() => {
    const age = Math.max(0, vehicleAge);
    let rate = classicCar ? 1 : age <= 6 ? 1.5 : 4.5;
    if (!isElectric && !classicCar) {
      if (steering === "right") rate *= 3;
      else if (hybrid && age <= 6) rate *= 0.4;
    }
    const excise = eligibleYear && validEngine
      ? isElectric ? (steering === "right" ? 3000 : 0) : engineCc * rate
      : 0;
    const importDuty = eligibleYear && validEngine && !isElectric
      ? engineCc * 0.05 * (1 + age * 0.05)
      : 0;
    const enteredCosts = [purchase, auction, inland, shipping, insurance, port, delivery];
    const knownCosts = enteredCosts.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    const unknownCosts = enteredCosts.filter((value) => value === null).length;
    return { excise, importDuty, knownCosts, unknownCosts, total: excise + importDuty + knownCosts, rate };
  }, [vehicleAge, steering, hybrid, classicCar, isElectric, engineCc, eligibleYear, validEngine, purchase, auction, inland, shipping, insurance, port, delivery]);

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
                    setClassicCar(false);
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
              <CostField id="engine-cc" label="Engine capacity (cm³)" value={engineCc} onChange={(value) => { setEngineCc(Math.round(value ?? 0)); setEngineId(""); setHybrid(false); setClassicCar(false); }} hint="Auto-filled from a selected variant. Edit to match the vehicle documents." />
              <div className="field">
                <label htmlFor="steering">Steering configuration</label>
                <select id="steering" value={steering} onChange={(event) => setSteering(event.target.value)}>
                  <option value="left">Left-hand drive</option>
                  <option value="right">Right-hand drive or converted</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="hybrid">Vehicle type</label>
                <select id="hybrid" value={isElectric ? "electric" : hybrid ? "hybrid" : classicCar ? "classic" : "other"} disabled={isElectric} onChange={(event) => {
                  setHybrid(event.target.value === "hybrid");
                  setClassicCar(event.target.value === "classic");
                }}>
                  <option value="electric" disabled>Electric (from selected engine variant)</option>
                  <option value="other">Non-hybrid</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="classic">Classic car (classification confirmed)</option>
                </select>
                <small>The 60% reduction applies only to left-hand-drive hybrids aged 0–6 years. Select classic only if the vehicle qualifies for the legal classic-car rate.</small>
              </div>
            </div>
            {(!eligibleYear || !validEngine || isElectric) && <div className="notice" role="status">{isElectric ? "Electric-vehicle excise and import-duty exemptions are included for left-hand-drive EVs; right-hand-drive or converted EVs use a GEL 3,000 excise amount. Verify special cases with the official calculator." : "Check the manufacture year and engine capacity before using this estimate."}</div>}
            <div className="notice">
              <strong>Rule used:</strong> {isElectric ? (steering === "right" ? "GEL 3,000 fixed excise for right-hand-drive/converted EVs" : "GEL 0 excise for left-hand-drive EVs") : classicCar ? "GEL 1.00 per cm³ for a vehicle classified as a classic car" : `${money(result.rate)} per cm³`}. {makeName && modelName && selectedEngine ? `${makeName} ${modelName} · ${selectedEngine.label} · purchase/shipping country: ${sourceCountry}.` : "Choose a vehicle variant if available, or enter the engine capacity manually."} The catalogue lists common variants only, not every year/market configuration. Transitional cases and vehicle classification need official verification.
            </div>
          </section>

          <aside className="panel result-panel" aria-live="polite">
            <span className="result-label">Preliminary excise estimate</span>
            <div className="result-total">{eligibleYear && validEngine ? money(result.excise) : "Check details"}</div>
            <p>{eligibleYear && validEngine ? (isElectric ? `${year} model year · electric vehicle` : `${year} model year · ${vehicleAge} year(s) old · ${engineCc.toLocaleString("en-US")} cm³`) : "Enter valid details and verify special cases."}</p>
            <div className="result-lines">
              <div className="result-line"><span>Excise rule</span><strong>{isElectric ? (steering === "right" ? "GEL 3,000 fixed" : "GEL 0") : classicCar ? "GEL 1.00 / cm³" : `${money(result.rate)} / cm³`}</strong></div>
              <div className="result-line"><span>Purchase and auction</span><strong>{enteredGroup([purchase, auction])}</strong></div>
              <div className="result-line"><span>Transport and insurance</span><strong>{enteredGroup([inland, shipping, insurance])}</strong></div>
              <div className="result-line"><span>Estimated import duty</span><strong>{eligibleYear && validEngine ? (isElectric ? "Exempt for EVs" : money(result.importDuty)) : "Check details"}</strong></div>
              <div className="result-line"><span>Port and local delivery</span><strong>{enteredGroup([port, delivery])}</strong></div>
              <div className="result-line"><span>Other entered costs subtotal</span><strong>{money(result.knownCosts)}</strong></div>
              <div className="result-line result-line-total"><span>Known costs + estimated vehicle taxes</span><strong>{eligibleYear && validEngine ? money(result.total) : "Check details"}</strong></div>
            </div>
            <div className="disclaimer"><strong>{result.unknownCosts} of 7 cost categories still unknown.</strong> {result.unknownCosts > 0 ? "The displayed budget excludes blank costs, so it is not a final landed-cost total." : "All additional cost fields have an entered amount. Confirm applicable service fees and special rules with official sources."} Import duty is estimated using engine size and age. Service fees, classification exceptions and transitional rules are not fully modelled.</div>
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
              <CostField id="port" label="Port, broker and storage (GEL)" value={port} onChange={setPort} />
              <CostField id="delivery" label="Local delivery / registration (GEL)" value={delivery} onChange={setDelivery} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-narrow prose">
          <h2>Important rules and verification</h2>
          <p>The Georgian Tax Code sets excise at GEL 1.50 per cm³ for passenger vehicles aged 0–6 years and GEL 4.50 per cm³ for older vehicles. Right-hand-drive or converted vehicles use three times the ordinary rate. Left-hand-drive hybrids aged 0–6 years receive a 60% reduction. The Code also provides a GEL 1.00 per cm³ rate for vehicles legally classified as classic cars, and sets excise at GEL 0 for left-hand-drive electric vehicles and GEL 3,000 for right-hand-drive or converted electric vehicles. Vehicle age is based on the year the customs declaration is registered, not the exact month or day. The catalogue is a practical starting list, not an official complete database.</p>
          <p>The planner estimates import duty using Article 197(6): GEL 0.05 per cm³, plus 5% of that base duty amount for each year of vehicle operation. The law exempts electric vehicles from import duty. This estimate does not determine transitional treatment based on earlier registration or transport documents, special classifications, service fees or other exceptions.</p>
          <p><strong>Before bidding or shipping, verify the exact vehicle in the official <a href={revenueServiceUrl} target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a>.</strong> If the vehicle&apos;s classification or transitional status is unclear, contact the Revenue Service.</p>
          <p>Sources: <a href="https://new.matsne.gov.ge/en/document/view/1043717" target="_blank" rel="noreferrer">Tax Code of Georgia, Articles 188, 197 and 199</a> and the <a href="https://voice.rs.ge/Default.aspx?id=3874" target="_blank" rel="noreferrer">Revenue Service notice on the April 2, 2026 change</a>. This estimate is informational, not a binding customs assessment. Verify the final amount with the official <a href={revenueServiceUrl} target="_blank" rel="noreferrer">Revenue Service calculator</a>.
        </div>
      </section>
    </>
  );
}
