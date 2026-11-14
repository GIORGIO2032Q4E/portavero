"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { importCountries, vehicleCatalog } from "@/data/vehicle-catalog";
import { calculateVehicleTaxes } from "@/lib/vehicle-tax.mjs";
import NumberField from "@/components/NumberField";
import { STANDARD_VEHICLE_FEES_GEL, summarizeVehicleImportCosts } from "@/lib/vehicle-import-costs.mjs";
import { validateVin } from "@/lib/vin.mjs";
import { getEngineCapacityForSelection, getManualVehicleTypeSelection } from "@/lib/vehicle-selection.mjs";
import {
  MAX_SAVED_VEHICLES,
  parseSavedVehicleCandidates,
  SAVED_VEHICLES_STORAGE_KEY,
  type SavedVehicleCandidate
} from "@/lib/saved-vehicles.mjs";

const revenueServiceUrl = "https://www.rs.ge/CarClearance-en";
const standardStateFees = STANDARD_VEHICLE_FEES_GEL;
type CostFieldKey = "purchase" | "auction" | "inland" | "shipping" | "insurance" | "port" | "delivery";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GEL",
    maximumFractionDigits: 2
  }).format(value);

const enteredGroup = (values: Array<number | null>) => {
  if (values.every((value) => value === null)) return "Not entered";
  const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  return Number.isFinite(total) && total <= Number.MAX_SAFE_INTEGER / 100
    ? money(total)
    : "Check details";
};

const roundMoney = (value: number) => Number(value.toFixed(2));

export default function VehicleImportPage() {
  const [year, setYear] = useState(2020);
  const [declarationYear, setDeclarationYear] = useState(new Date().getFullYear());
  const [makeName, setMakeName] = useState("");
  const [modelName, setModelName] = useState("");
  const [engineId, setEngineId] = useState("");
  const [sourceCountry, setSourceCountry] = useState("United States");
  const [engineCc, setEngineCc] = useState<number | null>(null);
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
  const [candidateName, setCandidateName] = useState("");
  const [vin, setVin] = useState("");
  const [vinVehicleName, setVinVehicleName] = useState("");
  const [vinElectric, setVinElectric] = useState(false);
  const [historyNotes, setHistoryNotes] = useState("");
  const [savedVehicleCount, setSavedVehicleCount] = useState(0);
  const [candidateMessage, setCandidateMessage] = useState("");
  const [invalidCostFields, setInvalidCostFields] = useState<Record<CostFieldKey, boolean>>({
    purchase: false,
    auction: false,
    inland: false,
    shipping: false,
    insurance: false,
    port: false,
    delivery: false
  });

  function handleCostFieldValidity(field: CostFieldKey, valid: boolean) {
    setInvalidCostFields((current) => {
      const invalid = !valid;
      return current[field] === invalid ? current : { ...current, [field]: invalid };
    });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingVin = params.get("vin") ?? "";

    if (validateVin(incomingVin).valid) {
      const make = (params.get("make") ?? "").slice(0, 80);
      const model = (params.get("model") ?? "").slice(0, 80);
      const matchingMake = vehicleCatalog.find((item) => item.name.toLowerCase() === make.toLowerCase());
      const matchingModel = matchingMake?.models.find((item) => item.name.toLowerCase() === model.toLowerCase());
      const modelYear = Number(params.get("year"));
      const capacity = Number(params.get("engineCc"));
      const fuel = (params.get("fuel") ?? "").toLowerCase();

      setVin(incomingVin.toUpperCase());
      setVinVehicleName([make, model].filter(Boolean).join(" ") || "Vehicle from VIN");
      if (matchingMake) setMakeName(matchingMake.name);
      if (matchingModel) setModelName(matchingModel.name);
      if (Number.isInteger(modelYear) && modelYear >= 1960 && modelYear <= new Date().getFullYear() + 2) {
        setYear(modelYear);
      }
      if (Number.isFinite(capacity) && capacity > 0 && capacity <= 100000) {
        setEngineCc(capacity);
      }
      setHybrid(fuel.includes("hybrid"));
      setVinElectric(fuel.includes("electric") && !fuel.includes("hybrid"));
      setSteering("");
    }

    try {
      const saved = parseSavedVehicleCandidates(
        window.localStorage.getItem(SAVED_VEHICLES_STORAGE_KEY)
      );
      setSavedVehicleCount(saved.items.length);
      if (saved.skipped) {
        setCandidateMessage("Some older comparison entries were skipped because their data was incomplete.");
      }
    } catch {
      setCandidateMessage("Browser storage is unavailable. Vehicles cannot be saved for comparison in this browser.");
    }
  }, []);

  const selectedMake = vehicleCatalog.find((make) => make.name === makeName);
  const selectedModel = selectedMake?.models.find((model) => model.name === modelName);
  const selectedEngine = selectedModel?.engines.find((engine) => engine.id === engineId);
  const isElectric = selectedEngine?.fuel === "Electric" || vinElectric;

  const currentYear = new Date().getFullYear();
  const vehicleAge = declarationYear - year;
  const eligibleYear = vehicleAge >= 0 && year <= declarationYear;
  const validEngine = isElectric || (engineCc !== null && Number.isFinite(engineCc) && engineCc > 0);
  const validVehicleType = !classicCar || vehicleAge > 30;
  const validSteering = steering === "left" || steering === "right";
  const canShowTaxEstimate = eligibleYear && validEngine && validVehicleType && validSteering;
  const hasInvalidCostField = Object.values(invalidCostFields).some(Boolean);

  const result = useMemo(() => {
    const taxes = calculateVehicleTaxes({
      manufactureYear: year,
      declarationYear,
      engineCc: engineCc ?? 0,
      steering,
      hybrid,
      classicCar,
      isElectric,
      preAprilRegime
    });
    const costSummary = summarizeVehicleImportCosts(
      { purchase, auction, inland, shipping, insurance, port, delivery },
      taxes.excise,
      taxes.importDuty,
      standardStateFees,
      hasInvalidCostField
    );
    return {
      excise: taxes.excise,
      importDuty: taxes.importDuty,
      knownCosts: costSummary.knownCosts,
      unknownCosts: costSummary.unknownCosts.length,
      invalidCosts: costSummary.invalidCosts,
      invalidTaxAmounts: costSummary.invalidTaxAmounts,
      invalidAmounts: costSummary.invalidAmounts,
      officialFees: standardStateFees,
      total: costSummary.total,
      rate: taxes.rate,
    };
  }, [year, declarationYear, steering, hybrid, classicCar, preAprilRegime, isElectric, engineCc, purchase, auction, inland, shipping, insurance, port, delivery, hasInvalidCostField]);

  function saveVehicleForComparison() {
    setCandidateMessage("");

    if (!makeName || !modelName) {
      setCandidateMessage("Choose the make and model before saving the car.");
      return;
    }

    if (!eligibleYear || !validEngine || !validVehicleType || result.invalidAmounts || result.total === null || result.knownCosts === null) {
      setCandidateMessage("Check the car details and cost fields first. Fix any invalid entries before saving it.");
      return;
    }

    const savedVin = vin.trim().toUpperCase();
    if (savedVin) {
      const validation = validateVin(savedVin);
      if (!validation.valid) {
        setCandidateMessage(validation.message);
        return;
      }
    }

    try {
      const existing = parseSavedVehicleCandidates(
        window.localStorage.getItem(SAVED_VEHICLES_STORAGE_KEY)
      );
      if (existing.items.length >= MAX_SAVED_VEHICLES) {
        setSavedVehicleCount(existing.items.length);
        setCandidateMessage("You can save up to four cars. Remove one from Compare before adding another.");
        return;
      }

      const riskReasons: string[] = [];
      if (result.unknownCosts > 0) {
        riskReasons.push(`${result.unknownCosts} cost categories are still unknown, so this is not a final landed-cost figure.`);
      }
      if (declarationYear > currentYear) {
        riskReasons.push(`The customs declaration is planned for ${declarationYear}. This estimate uses the ${currentYear} rules and fee snapshot; future changes are not predicted.`);
      }
      if (!selectedEngine) {
        riskReasons.push("You entered the engine details yourself. Check them against the car's documents.");
      } else {
        riskReasons.push("The catalogue only shows common versions. Check that this is the same engine as the one in the car.");
      }
      if (savedVin) {
        riskReasons.push("The VIN is saved for reference. This does not decode it or check the car's history.");
      } else {
        riskReasons.push("No VIN was recorded or decoded for this candidate.");
      }
      if (historyNotes.trim()) {
        riskReasons.push("History and condition notes were entered by the user and have not been independently verified.");
      } else {
        riskReasons.push("No accident, title, mileage, service or auction details were added. That does not mean the car has a clean history.");
      }
      if (!preAprilRegime && vehicleAge > 6 && !isElectric && !classicCar) {
        riskReasons.push("The current base excise rate for a vehicle over 6 years old is GEL 4.50 per cm³ before applicable adjustments. This is a tax band, not a general age-based import ban.");
      }
      if (preAprilRegime) {
        riskReasons.push("Previous tax rules were selected. Eligibility for transitional treatment has not been verified.");
      }
      if (classicCar) {
        riskReasons.push("Classic-car classification must be confirmed by the relevant authority.");
      }

      const candidate: SavedVehicleCandidate = {
        id: window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
        name: candidateName.trim() || `${makeName} ${modelName} · ${year}`,
        savedAt: new Date().toISOString(),
        make: makeName,
        model: modelName,
        engineLabel: selectedEngine?.label ?? "Manual engine entry",
        fuel: selectedEngine?.fuel ?? (isElectric ? "Electric" : hybrid ? "Hybrid" : "Not confirmed"),
        engineCc: engineCc ?? 0,
        engineVerified: Boolean(selectedEngine),
        year,
        declarationYear,
        sourceCountry,
        steering: steering === "right" ? "right" : "left",
        hybrid,
        isElectric,
        classicCar,
        preAprilRegime,
        vin: savedVin,
        historyNotes: historyNotes.trim(),
        costs: { purchase, auction, inland, shipping, insurance, port, delivery },
        knownCosts: roundMoney(result.knownCosts),
        excise: roundMoney(result.excise),
        importDuty: roundMoney(result.importDuty),
        officialFees: roundMoney(result.officialFees),
        estimatedTotal: roundMoney(result.total),
        unknownCosts: result.unknownCosts,
        riskReasons
      };

      const next = [candidate, ...existing.items];
      window.localStorage.setItem(SAVED_VEHICLES_STORAGE_KEY, JSON.stringify(next));
      setSavedVehicleCount(next.length);
      setCandidateMessage("Saved in this browser. Add another car or open Compare to view your shortlist.");
    } catch {
      setCandidateMessage("Couldn't save the car. Check whether browser storage is available.");
    }
  }

  return (
    <div className="vehicle-import-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Vehicle import planner</span>
          <h1>{vin ? "Import estimate for this car" : "Estimate the cost of importing a car."}</h1>
          <p>{vin ? "Available details from the VIN have been added below. Check them against the car and its documents, fill in anything missing, then add the costs you know." : "Start with a VIN to fill in the car details, or enter them manually. Then add the costs you know to estimate selected Georgian vehicle taxes and import expenses."}</p>
          <div className="hero-actions">
            <a href={revenueServiceUrl} target="_blank" rel="noreferrer" className="button button-outline">Open official Revenue Service calculator ↗</a>
            <Link href="/vehicles" className="button button-dark">Browse vehicle catalogue</Link>
            <Link href="/how-it-works" className="button button-outline">How estimates work</Link>
            <button type="button" className="button button-dark print-trigger" onClick={() => window.print()}>Print or save as PDF</button>
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
            <div><span>Vehicle</span><strong>{vinVehicleName || [makeName, modelName].filter(Boolean).join(" ") || "Not selected"}</strong></div>
            {vin && <div><span>VIN</span><strong>{vin}</strong></div>}
            <div><span>Engine / powertrain</span><strong>{selectedEngine?.label ?? (engineCc === null ? "Not entered" : `${engineCc.toLocaleString("en-US")} cm³ · manual entry`)}</strong></div>
            <div><span>Purchase country</span><strong>{sourceCountry}</strong></div>
            <div><span>Manufacture year</span><strong>{year}</strong></div>
            <div><span>Declaration year / age</span><strong>{declarationYear} · {vehicleAge} year(s)</strong></div>
            <div><span>Configuration</span><strong>{steering === "right" ? "Right-hand drive" : steering === "left" ? "Left-hand drive" : "Steering not confirmed"} · {isElectric ? "Electric" : hybrid ? "Hybrid" : "Non-hybrid"}{classicCar ? " · classic-car rate" : ""}</strong></div>
          </div>
          <div className="tool-layout">
          <section className="panel vehicle-panel">
            <div className="vehicle-section-heading"><span className="step-chip">01</span><div><span className="eyebrow">Start with the car</span><h2>Identify your vehicle</h2></div></div>
            <p className="panel-intro">This planner covers selected passenger cars under HS 8703. It does not cover every vehicle or tax exception, so check unusual cases with the Revenue Service.</p>
            <div className="notice"><strong>Important:</strong> This planner only covers selected passenger cars under HS 8703. It does not determine the car's tariff classification, cover every exemption or confirm transitional eligibility. It also does not include the separate sports-car excise treatment in Article 188(9). Electric and classic-car calculations are limited to the cases shown here. Check special cases with the Revenue Service.</div>
            {vin && <div className="notice" role="status"><strong>Details loaded from VIN for {vinVehicleName}.</strong> {engineCc === null && !isElectric ? "NHTSA did not return an engine size. Enter it from the car's documents. " : "Check the returned engine size and model year against the car's documents. "}Choose the steering side below; it is not confirmed by this VIN lookup.</div>}
            <div className="form-grid">
              <div className="field">
                <label htmlFor="source-country">Country of purchase</label>
                <select id="source-country" value={sourceCountry} onChange={(event) => setSourceCountry(event.target.value)}>
                  {importCountries.map((country) => <option key={country} value={country}>{country}</option>)}
                </select>
                <small>This is saved with the car so you can recognise it later. The current tax calculation does not use the purchase country.</small>
              </div>
              <div className="field">
                <label htmlFor="make">Make</label>
                <select id="make" value={makeName} onChange={(event) => { setMakeName(event.target.value); setModelName(""); setEngineId(""); setEngineCc(null); setHybrid(false); setVinElectric(false); setClassicCar(false); }}>
                  <option value="">Choose a make</option>
                  {vehicleCatalog.map((make) => <option key={make.name} value={make.name}>{make.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="model">Model</label>
                <select id="model" value={modelName} disabled={!selectedMake} onChange={(event) => { setModelName(event.target.value); setEngineId(""); setEngineCc(null); setHybrid(false); setClassicCar(false); }}>
                  <option value="">Choose a model</option>
                  {selectedMake?.models.map((model) => <option key={model.name} value={model.name}>{model.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="engine-variant">Engine / powertrain</label>
                <select id="engine-variant" value={engineId} disabled={!selectedModel} onChange={(event) => {
                  const id = event.target.value;
                  const engine = selectedModel?.engines.find((item) => item.id === id);
                  setEngineId(id);
                  setVinElectric(false);
                  setEngineCc(getEngineCapacityForSelection(engine));
                  setHybrid(engine?.fuel === "Hybrid" || engine?.fuel === "Plug-in hybrid");
                  setClassicCar(false);
                }}>
                  <option value="">Choose an engine variant</option>
                  {selectedModel?.engines.map((engine) => <option key={engine.id} value={engine.id}>{engine.label} · {engine.cc > 0 ? engine.cc.toLocaleString("en-US") + " cm³" : engine.fuel === "Electric" ? "EV" : "capacity varies"}</option>)}
                </select>
                <small>{selectedEngine ? [selectedEngine.fuel, selectedEngine.years, selectedEngine.note].filter(Boolean).join(" · ") : "These are common versions, not a match for every car. Check the engine code on the car's documents."}</small>
              </div>
              <div className="field">
                <label htmlFor="manufacture-year">Manufacture year</label>
                <select id="manufacture-year" value={year} onChange={(event) => { setYear(Number(event.target.value)); setClassicCar(false); }}>
                  {Array.from({ length: currentYear - 1960 + 3 }, (_, index) => currentYear + 2 - index).map((value) => (
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
                <small>The planner uses the declaration year to work out the car's age.</small>
              </div>
              <NumberField id="engine-cc" label="Engine capacity (cm³)" value={engineCc} step={1} max={100000} inputMode="numeric" onChange={(value) => { setEngineCc(value); setEngineId(""); }} hint={selectedEngine?.cc === 0 && !isElectric ? "This model comes with different engine sizes. Enter the capacity shown in the car's documents. Portavero will not guess it." : "If you chose an engine above, its capacity is filled in here. Check it against the car's documents."} />
              <div className="field">
                <label htmlFor="pre-april-regime">Tax regime for this import</label>
                <select id="pre-april-regime" value={preAprilRegime ? "previous" : "current"} onChange={(event) => setPreAprilRegime(event.target.value === "previous")}>
                  <option value="current">Current rules (from 2 April 2026)</option>
                  <option value="previous">Previous rules (eligible transitional cases only)</option>
                </select>
                <small>Choose the previous rules only if your documents meet the Revenue Service's transition conditions.</small>
              </div>
              <div className="field">
                <label htmlFor="steering">Steering configuration</label>
                <select id="steering" value={steering} onChange={(event) => setSteering(event.target.value)}>
                  <option value="">Choose steering side</option>
                  <option value="left">Left-hand drive</option>
                  <option value="right">Right-hand drive or converted</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="hybrid">Vehicle type</label>
                <select id="hybrid" value={isElectric ? "electric" : hybrid ? "hybrid" : classicCar ? "classic" : "other"} disabled={isElectric} onChange={(event) => {
                  const next = getManualVehicleTypeSelection(event.target.value);
                  setEngineId(next.engineId);
                  setVinElectric(false);
                  setEngineCc(null);
                  setHybrid(next.hybrid);
                  setClassicCar(next.classicCar);
                }}>
                  <option value="electric" disabled>Electric (from selected engine variant)</option>
                  <option value="other">Non-hybrid</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="classic" disabled={vehicleAge <= 30}>Classic car (over 30 years old, classification confirmed)</option>
                </select>
                <small>The 60% reduction is only for left-hand-drive hybrids aged 0–6 years. Choose the classic-car option only if the car meets the legal classification.</small>
              </div>
            </div>
            {vin && !validSteering && <div className="notice" role="alert">Choose whether the car is left-hand drive or right-hand drive before using the tax estimate. The VIN lookup does not confirm steering side.</div>}
            {preAprilRegime && <div className="notice" role="status"><strong>Using the previous tax rules?</strong> Selecting this option does not mean the car qualifies. The Revenue Service asks for specific registration and transport documents, and the deadlines depend on how the car was moved. Check your documents with them before relying on this estimate.</div>}
            {declarationYear > currentYear && <div className="notice" role="status"><strong>Planning for {declarationYear}?</strong> This uses the tax rules and GEL 480 fee list currently stored in Portavero. Rates, fees and requirements may change before then, so treat the result as a rough guide, not a forecast.</div>}
            {!preAprilRegime && vehicleAge > 6 && !isElectric && !classicCar && <div className="notice" role="status"><strong>Cars over 6 years old:</strong> the base excise rate is GEL 4.50 per cm³ before any applicable adjustments. The previously proposed age-based registration ban was replaced by this higher rate. Other emissions, vehicle-category and registration rules may still apply, so check the exact car before buying or shipping.</div>}
            {(!eligibleYear || !validEngine || !validVehicleType || isElectric) && <div className="notice" role="status">{isElectric ? "This planner includes a limited calculation for electric passenger cars. Check the car's classification and any special rules with the Revenue Service." : !validVehicleType ? "The classic-car rate is only available for cars over 30 years old that meet the legal classification." : "Check the manufacture year and engine size before relying on the estimate."}</div>}
            <div className="notice">
              <strong>Rate used:</strong> {preAprilRegime ? "Previous age-based excise table (transitional cases only)" : "Current rates from 2 April 2026"}. {isElectric ? (steering === "right" ? (preAprilRegime ? "Previous rule: age-based rate × 2,000 for right-hand-drive/converted EVs" : "GEL 3,000 fixed excise for right-hand-drive/converted EVs") : "GEL 0 excise for left-hand-drive EVs") : classicCar ? "GEL 1.00 per cm³ for a vehicle classified as a classic car" : `${money(result.rate)} per cm³`}. {makeName && modelName && selectedEngine ? `${makeName} ${modelName} · ${selectedEngine.label} · purchase/shipping country: ${sourceCountry}.` : "Choose an engine from the list, or enter its capacity yourself."} The catalogue lists common variants only, not every year/market configuration. Transitional cases and vehicle classification need official verification.
            </div>
          </section>

          <aside className="panel result-panel" aria-live="polite">
            <span className="result-label">Estimated excise</span>
            <div className="result-total">{canShowTaxEstimate && !result.invalidTaxAmounts ? money(result.excise) : "Check details"}</div>
            <p>{canShowTaxEstimate ? (isElectric ? `${year} model year · electric vehicle` : `${year} model year · declaration ${declarationYear} · ${vehicleAge} year(s) old · ${(engineCc ?? 0).toLocaleString("en-US")} cm³`) : "Check the car details and any special rules."}</p>
            <div className="result-lines">
              <div className="result-line"><span>Excise rule</span><strong>{isElectric ? (steering === "right" ? (preAprilRegime ? "Previous rate × 2,000" : "GEL 3,000 fixed") : "GEL 0") : classicCar ? "GEL 1.00 / cm³" : `${money(result.rate)} / cm³`}</strong></div>
              <div className="result-line"><span>Purchase and auction</span><strong>{enteredGroup([purchase, auction])}</strong></div>
              <div className="result-line"><span>Transport and insurance</span><strong>{enteredGroup([inland, shipping, insurance])}</strong></div>
              <div className="result-line"><span>Estimated import duty</span><strong>{canShowTaxEstimate && !result.invalidTaxAmounts ? (isElectric ? "Exempt for EVs" : money(result.importDuty)) : "Check details"}</strong></div>
              <div className="result-line"><span>Standard listed clearance and registration fees</span><strong>{money(result.officialFees)}</strong></div>
              <div className="result-line"><span>Port and local delivery</span><strong>{enteredGroup([port, delivery])}</strong></div>
              <div className="result-line"><span>Other costs you entered</span><strong>{result.knownCosts === null ? "Check details" : money(result.knownCosts)}</strong></div>
              <div className="result-line result-line-total"><span>Known costs, estimated taxes and standard fees</span><strong>{canShowTaxEstimate && result.total !== null && !result.invalidAmounts ? money(result.total) : "Check details"}</strong></div>
            </div>
            <div className="disclaimer">{result.invalidAmounts && <><strong>One of the amounts needs checking.</strong> Portavero cannot safely calculate the total until you fix the invalid entry. </>}<strong>{result.unknownCosts} of 7 cost categories still unknown.</strong> {result.unknownCosts > 0 ? "Blank costs are not included, so this is not the final price of the car." : "You've entered an amount for every additional cost."} The total includes GEL 480 in listed standard fees. A broker, storage, special handling, vehicle classification or transitional rules may add costs or change the tax amount.</div>
          </aside>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Add the costs you know</span>
            <h2>Add the other costs</h2>
            <p>Enter amounts in GEL. Convert foreign-currency quotes using an exchange rate you have checked. Leave a cost blank until you know it; blank does not mean free.</p>
          </div>
          <div className="panel">
            <div className="form-grid">
              <NumberField id="purchase" label="Vehicle purchase price (GEL)" value={purchase} onChange={setPurchase} onValidityChange={(valid) => handleCostFieldValidity("purchase", valid)} />
              <NumberField id="auction" label="Auction / buyer fees (GEL)" value={auction} onChange={setAuction} onValidityChange={(valid) => handleCostFieldValidity("auction", valid)} />
              <NumberField id="inland" label="Origin inland transport (GEL)" value={inland} onChange={setInland} onValidityChange={(valid) => handleCostFieldValidity("inland", valid)} />
              <NumberField id="shipping" label="International shipping (GEL)" value={shipping} onChange={setShipping} onValidityChange={(valid) => handleCostFieldValidity("shipping", valid)} />
              <NumberField id="insurance" label="Insurance (GEL)" value={insurance} onChange={setInsurance} onValidityChange={(valid) => handleCostFieldValidity("insurance", valid)} />
              <NumberField id="port" label="Port, broker and storage (GEL)" value={port} onChange={setPort} onValidityChange={(valid) => handleCostFieldValidity("port", valid)} />
              <NumberField id="delivery" label="Local delivery / other costs (GEL)" value={delivery} onChange={setDelivery} onValidityChange={(valid) => handleCostFieldValidity("delivery", valid)} hint="Exclude standard registration and clearance fees already counted above." />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel compare-save-panel">
            <span className="eyebrow">Your shortlist</span>
            <h2>Save this car to compare it later.</h2>
            <p className="panel-intro">Save the car details and current estimate in this browser. You can add condition or history notes, but include where the information came from. Portavero does not verify those notes or check accident, title, mileage, service or auction records.</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="candidate-name">Name this car (optional)</label>
                <input id="candidate-name" value={candidateName} onChange={(event) => setCandidateName(event.target.value)} maxLength={100} placeholder={makeName && modelName ? `${makeName} ${modelName} · ${year}` : "e.g. Prius from auction listing A"} />
              </div>
              <div className="field">
                <label htmlFor="candidate-vin">VIN (optional)</label>
                <input id="candidate-vin" value={vin} onChange={(event) => setVin(event.target.value.toUpperCase())} maxLength={17} autoComplete="off" spellCheck={false} placeholder="Enter a 17-character VIN" />
                <small>The VIN is saved here for reference. To see the technical details NHTSA can return, open <Link href="/vin-check" className="text-link">VIN Check</Link>.</small>
              </div>
              <label className="field compare-notes-field" htmlFor="history-notes">
                <span>Condition or history notes (optional)</span>
                <textarea id="history-notes" rows={4} value={historyNotes} onChange={(event) => setHistoryNotes(event.target.value)} maxLength={1200} placeholder="Add only details you can trace to a source. For example: “Seller reports rear bumper damage” or “Inspection report dated…”. " />
                <small>These are your notes, not verified vehicle records. No notes does not mean the car has a clean history.</small>
              </label>
            </div>
            <div className="hero-actions">
              <button type="button" className="button button-dark" onClick={saveVehicleForComparison} disabled={savedVehicleCount >= MAX_SAVED_VEHICLES}>
                Save for comparison ({savedVehicleCount}/{MAX_SAVED_VEHICLES})
              </button>
              <Link href="/compare" className="button button-outline">Open vehicle comparison ↗</Link>
            </div>
            {candidateMessage && <p className="estimate-save-message" role="status">{candidateMessage}</p>}
            <p className="calculator-footer-note">Saved cars stay in this browser on this device. They are not synced to your account or another device.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-narrow prose">
          <h2>Tax rules and where to check them</h2>
          <p>For the passenger-car cases covered here, the current rules (from 2 April 2026) use a base excise rate of GEL 1.50 per cm³ for cars aged 0–6 years and GEL 4.50 per cm³ for older cars. Right-hand-drive or converted cars use three times the ordinary rate. Left-hand-drive hybrids aged 0–6 years get a 60% reduction. This version calculates GEL 0 excise for left-hand-drive electric cars and GEL 3,000 for right-hand-drive or converted electric cars. It also includes the GEL 1.00 per cm³ rate for cars over 30 years old that are legally classified as classic cars. The car's age is based on the manufacture year and the year its customs declaration is registered, not the exact date. The vehicle list is only a guide to common variants.</p>
          <p>Import duty is estimated under Article 197(6): GEL 0.05 per cm³, with an extra 5% of the base duty for each year the car has been in use. Electric cars are exempt from import duty. The previous excise rates can be selected only for cases that meet the transitional rules, and the required documents must be checked with the Revenue Service. The estimate also includes GEL 480 in listed fees: GEL 150 clearance, GEL 50 declaration, GEL 30 expert examination, GEL 50 internal transit number, GEL 100 registration certificate, GEL 80 number plate and GEL 20 inspection act. Broker fees, storage, special handling and other exceptions are not included.</p>
          <p><strong>Before you bid or ship the car, check its details in the official <a href={revenueServiceUrl} target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a>.</strong> If you are unsure about its classification or whether the transitional rules apply, ask the Revenue Service.</p>
          <p>Sources: <a href="https://new.matsne.gov.ge/en/document/view/1043717" target="_blank" rel="noreferrer">Tax Code of Georgia, Articles 188, 197 and 199</a> and the <a href="https://voice.rs.ge/Default.aspx?id=3874" target="_blank" rel="noreferrer">Revenue Service notice on the April 2, 2026 change</a>. This estimate is informational, not a binding customs assessment. Verify the final amount with the official <a href={revenueServiceUrl} target="_blank" rel="noreferrer">Revenue Service calculator</a>.</p>
        </div>
      </section>
    </div>
  );
}
