"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { importCountries, vehicleCatalog } from "@/data/vehicle-catalog";
import { calculateVehicleTaxes } from "@/lib/vehicle-tax.mjs";
import NumberField from "@/components/NumberField";

const revenueServiceUrl = "https://www.rs.ge/CarClearance-en";
const standardStateFees = 480;

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

export default function VehicleImportPage() {
  const [year, setYear] = useState(2020);
  const [declarationYear, setDeclarationYear] = useState(new Date().getFullYear());
  const [makeName, setMakeName] = useState("");
  const [modelName, setModelName] = useState("");
  const [engineId, setEngineId] = useState("");
  const [sourceCountry, setSourceCountry] = useState("United States");
  const [engineCc, setEngineCc] = useState(2000);
  const [steering, setSteering] = useState("left");
  const [hybrid, setHybrid] = useState(false);
  const [classicCar, setClassicCar] = useState(false);
  const [preAprilRegime, setPreAprilRegime] = useState(false);
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
  const vehicleAge = declarationYear - year;
  const eligibleYear = vehicleAge >= 0 && year <= declarationYear;
  const validEngine = isElectric || (Number.isFinite(engineCc) && engineCc > 0);
  const validVehicleType = !classicCar || vehicleAge > 30;

  const result = useMemo(() => {
    const taxes = calculateVehicleTaxes({
      manufactureYear: year,
      declarationYear,
      engineCc,
      steering,
      hybrid,
      classicCar,
      isElectric,
      preAprilRegime
    });
    const enteredCosts = [purchase, auction, inland, shipping, insurance, port, delivery];
    const knownCosts = enteredCosts.reduce<number>((sum, value) => sum + (value ?? 0), 0);
    const unknownCosts = enteredCosts.filter((value) => value === null).length;
    return {
      excise: taxes.excise,
      importDuty: taxes.importDuty,
      knownCosts,
      unknownCosts,
      officialFees: standardStateFees,
      total: taxes.excise + taxes.importDuty + standardStateFees + knownCosts,
      rate: taxes.rate,
      registrationRestricted: taxes.registrationRestricted
    };
  }, [year, declarationYear, steering, hybrid, classicCar, preAprilRegime, isElectric, engineCc, purchase, auction, inland, shipping, insurance, port, delivery]);

  return (
    <div className="vehicle-import-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Vehicle import planner</span>
          <h1>Estimate the cost of importing a car.</h1>
          <p>Enter your car details and known costs to estimate excise and import duty for Georgia. Check the result with the official Revenue Service calculator.</p>
          <div className="hero-actions">
            <a href={revenueServiceUrl} target="_blank" rel="noreferrer" className="button button-outline">Open official Revenue Service calculator ↗</a>
            <Link href="/vehicles" className="button button-dark">Browse vehicle catalogue</Link>
            <Link href="/how-it-works" className="button button-outline">How estimates work</Link>
            <button type="button" className="button button-dark print-trigger" onClick={() => window.print()}>Print / Save as PDF</button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="print-report-meta">
            <strong>Portavero · Vehicle import estimate</strong>
            <span>All amounts are shown in Georgian lari (GEL).</span>
          </div>
          <div className="print-vehicle-summary">
            <div><span>Vehicle</span><strong>{[makeName, modelName].filter(Boolean).join(" ") || "Not selected"}</strong></div>
            <div><span>Engine / powertrain</span><strong>{selectedEngine?.label ?? (isElectric ? "Electric" : `${engineCc.toLocaleString("en-US")} cm³ · manual entry`)}</strong></div>
            <div><span>Purchase country</span><strong>{sourceCountry}</strong></div>
            <div><span>Manufacture year</span><strong>{year}</strong></div>
            <div><span>Declaration year / age</span><strong>{declarationYear} · {vehicleAge} year(s)</strong></div>
            <div><span>Configuration</span><strong>{steering === "right" ? "Right-hand drive" : "Left-hand drive"} · {isElectric ? "Electric" : hybrid ? "Hybrid" : "Non-hybrid"}{classicCar ? " · classic-car rate" : ""}</strong></div>
          </div>
          <div className="tool-layout">
          <section className="panel vehicle-panel">
            <div className="vehicle-section-heading"><span className="step-chip">01</span><div><span className="eyebrow">Start with the car</span><h2>Identify your vehicle</h2></div></div>
            <p className="panel-intro">This estimate uses a limited set of rules for passenger vehicles classified under HS 8703. Check the official calculator if you are unsure about your vehicle.</p>
            <div className="notice"><strong>Important:</strong> This is an estimate for passenger vehicles under HS 8703. Electric-vehicle rules and the classic-car rate are included, but special classification and transitional cases still need official verification.</div>
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
                <select id="make" value={makeName} onChange={(event) => { setMakeName(event.target.value); setModelName(""); setEngineId(""); setHybrid(false); setClassicCar(false); }}>
                  <option value="">Choose a make</option>
                  {vehicleCatalog.map((make) => <option key={make.name} value={make.name}>{make.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="model">Model</label>
                <select id="model" value={modelName} disabled={!selectedMake} onChange={(event) => { setModelName(event.target.value); setEngineId(""); setHybrid(false); setClassicCar(false); }}>
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
                <select id="manufacture-year" value={year} onChange={(event) => { setYear(Number(event.target.value)); setClassicCar(false); }}>
                  {Array.from({ length: currentYear - 1960 + 1 }, (_, index) => currentYear - index).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="declaration-year">Expected customs declaration year</label>
                <select id="declaration-year" value={declarationYear} onChange={(event) => { setDeclarationYear(Number(event.target.value)); setClassicCar(false); }}>
                  {Array.from({ length: 6 }, (_, index) => currentYear + index).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <small>Vehicle age is calculated from this year, as required by the Tax Code.</small>
              </div>
              <NumberField id="engine-cc" label="Engine capacity (cm³)" value={engineCc} onChange={(value) => { setEngineCc(Math.round(value ?? 0)); setEngineId(""); setHybrid(false); setClassicCar(false); }} hint="Auto-filled from a selected variant. Edit to match the vehicle documents." />
              <div className="field">
                <label htmlFor="pre-april-regime">Tax regime for this import</label>
                <select id="pre-april-regime" value={preAprilRegime ? "previous" : "current"} onChange={(event) => setPreAprilRegime(event.target.value === "previous")}>
                  <option value="current">Current rules (from 2 April 2026)</option>
                  <option value="previous">Previous rules (eligible transitional cases only)</option>
                </select>
                <small>Choose the previous regime only if your documents meet the Revenue Service transition conditions.</small>
              </div>
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
                  <option value="classic" disabled={vehicleAge <= 30}>Classic car (over 30 years old, classification confirmed)</option>
                </select>
                <small>The 60% reduction applies only to left-hand-drive hybrids aged 0–6 years. Select classic only if the vehicle qualifies for the legal classic-car rate.</small>
              </div>
            </div>
            {preAprilRegime && <div className="notice" role="status"><strong>Transitional-rate warning:</strong> selecting the previous rules does not establish eligibility. The Revenue Service requires qualifying registration, transport, or shipping documents and applies different deadlines to different transport methods. Confirm eligibility before relying on this result.</div>}
            {result.registrationRestricted && <div className="notice" role="alert"><strong>Registration eligibility warning:</strong> from 1 April 2026, initial and temporary registration in Georgia is generally restricted for M1 passenger vehicles older than 6 years. Exceptions may apply to electric vehicles, re-export/transit cases, vehicles already registered or imported before the cutoff, and qualifying transport that began before the cutoff. This calculator estimates taxes only and cannot confirm registration eligibility. Check the official rules before buying or shipping.</div>}
            {(!eligibleYear || !validEngine || !validVehicleType || isElectric) && <div className="notice" role="status">{isElectric ? "Electric-vehicle excise and import-duty rules are included for passenger cars. Verify classification and special cases with the official calculator." : !validVehicleType ? "The classic-car rate is available only when the vehicle is more than 30 years old and qualifies under the legal classification." : "Check the manufacture year and engine capacity before using this estimate."}</div>}
            <div className="notice">
              <strong>Rule used:</strong> {preAprilRegime ? "Previous age-based excise table (transitional cases only)" : "Current rates from 2 April 2026"}. {isElectric ? (steering === "right" ? (preAprilRegime ? "Previous rule: age-based rate × 2,000 for right-hand-drive/converted EVs" : "GEL 3,000 fixed excise for right-hand-drive/converted EVs") : "GEL 0 excise for left-hand-drive EVs") : classicCar ? "GEL 1.00 per cm³ for a vehicle classified as a classic car" : `${money(result.rate)} per cm³`}. {makeName && modelName && selectedEngine ? `${makeName} ${modelName} · ${selectedEngine.label} · purchase/shipping country: ${sourceCountry}.` : "Choose a vehicle variant if available, or enter the engine capacity manually."} The catalogue lists common variants only, not every year/market configuration. Transitional cases and vehicle classification need official verification.
            </div>
          </section>

          <aside className="panel result-panel" aria-live="polite">
            <span className="result-label">Preliminary excise estimate</span>
            <div className="result-total">{eligibleYear && validEngine && validVehicleType ? money(result.excise) : "Check details"}</div>
            <p>{eligibleYear && validEngine && validVehicleType ? (isElectric ? `${year} model year · electric vehicle` : `${year} model year · declaration ${declarationYear} · ${vehicleAge} year(s) old · ${engineCc.toLocaleString("en-US")} cm³`) : "Enter valid details and verify special cases."}</p>
            <div className="result-lines">
              <div className="result-line"><span>Excise rule</span><strong>{isElectric ? (steering === "right" ? (preAprilRegime ? "Previous rate × 2,000" : "GEL 3,000 fixed") : "GEL 0") : classicCar ? "GEL 1.00 / cm³" : `${money(result.rate)} / cm³`}</strong></div>
              <div className="result-line"><span>Purchase and auction</span><strong>{enteredGroup([purchase, auction])}</strong></div>
              <div className="result-line"><span>Transport and insurance</span><strong>{enteredGroup([inland, shipping, insurance])}</strong></div>
              <div className="result-line"><span>Estimated import duty</span><strong>{eligibleYear && validEngine && validVehicleType ? (isElectric ? "Exempt for EVs" : money(result.importDuty)) : "Check details"}</strong></div>
              <div className="result-line"><span>Standard listed customs and registration fees</span><strong>{money(result.officialFees)}</strong></div>
              <div className="result-line"><span>Port and local delivery</span><strong>{enteredGroup([port, delivery])}</strong></div>
              <div className="result-line"><span>Other entered costs subtotal</span><strong>{money(result.knownCosts)}</strong></div>
              <div className="result-line result-line-total"><span>Known costs + estimated taxes + standard fees</span><strong>{eligibleYear && validEngine && validVehicleType ? money(result.total) : "Check details"}</strong></div>
            </div>
            <div className="disclaimer"><strong>{result.unknownCosts} of 7 cost categories still unknown.</strong> {result.unknownCosts > 0 ? "The displayed budget excludes blank costs, so it is not a final landed-cost total." : "All additional cost fields have an entered amount."} The total includes GEL 480 in standard listed customs and registration fees. Broker charges, storage, special handling, classification exceptions and transitional rules may add costs or change the tax treatment.</div>
          </aside>
          </div>
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
              <NumberField id="purchase" label="Vehicle purchase price (GEL)" value={purchase} onChange={setPurchase} />
              <NumberField id="auction" label="Auction / buyer fees (GEL)" value={auction} onChange={setAuction} />
              <NumberField id="inland" label="Origin inland transport (GEL)" value={inland} onChange={setInland} />
              <NumberField id="shipping" label="International shipping (GEL)" value={shipping} onChange={setShipping} />
              <NumberField id="insurance" label="Insurance (GEL)" value={insurance} onChange={setInsurance} />
              <NumberField id="port" label="Port, broker and storage (GEL)" value={port} onChange={setPort} />
              <NumberField id="delivery" label="Local delivery / other costs (GEL)" value={delivery} onChange={setDelivery} hint="Exclude standard registration and clearance fees already counted above." />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-narrow prose">
          <h2>Important rules and verification</h2>
          <p>For imports taxed under the rules effective from 2 April 2026, Georgia sets excise at GEL 1.50 per cm³ for passenger vehicles aged 0–6 years and GEL 4.50 per cm³ for older vehicles. Right-hand-drive or converted vehicles use three times the ordinary rate; left-hand-drive hybrids aged 0–6 years receive a 60% reduction. Right-hand-drive or converted electric cars have a GEL 3,000 excise rate, while left-hand-drive electric cars have GEL 0 excise. The law contains transitional provisions for qualifying vehicles based on registration and transport documents. The Code also provides a GEL 1.00 per cm³ rate for vehicles legally classified as classic cars, and sets excise at GEL 0 for left-hand-drive electric vehicles and GEL 3,000 for right-hand-drive or converted electric vehicles. Vehicle age is based on the year the customs declaration is registered, not the exact month or day. The catalogue is a practical starting list, not an official complete database.</p>
          <p>The planner estimates import duty using Article 197(6): GEL 0.05 per cm³, plus 5% of that base duty amount for each year of vehicle operation. The law exempts electric vehicles from import duty. Previous excise rates are available only as a manual transitional option and must be supported by the documents required by the Revenue Service. The result also adds GEL 480 for the standard listed fees shown by the Revenue Service: GEL 150 clearance, GEL 50 declaration, GEL 30 expert inspection, GEL 50 internal transit number, GEL 100 registration certificate, GEL 80 registration plate and GEL 20 vehicle inspection. Optional broker fees, storage, special classifications and transitional treatment based on earlier registration or transport documents still require checking.</p>
          <p><strong>Before bidding or shipping, verify the exact vehicle in the official <a href={revenueServiceUrl} target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a>.</strong> If the vehicle&apos;s classification or transitional status is unclear, contact the Revenue Service.</p>
          <p>Sources: <a href="https://new.matsne.gov.ge/en/document/view/1043717" target="_blank" rel="noreferrer">Tax Code of Georgia, Articles 188, 197 and 199</a> and the <a href="https://voice.rs.ge/Default.aspx?id=3874" target="_blank" rel="noreferrer">Revenue Service notice on the April 2, 2026 change</a>. This estimate is informational, not a binding customs assessment. Verify the final amount with the official <a href={revenueServiceUrl} target="_blank" rel="noreferrer">Revenue Service calculator</a>.</p>
        </div>
      </section>
    </div>
  );
}
