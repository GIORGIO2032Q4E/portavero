"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const revenueServiceUrl = "https://www.rs.ge/CarClearance-en";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GEL",
    maximumFractionDigits: 2
  }).format(value);

function CostField({
  id,
  label,
  value,
  onChange,
  hint
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
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
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
      />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function VehicleImportPage() {
  const [year, setYear] = useState(2020);
  const [engineCc, setEngineCc] = useState(2000);
  const [steering, setSteering] = useState("left");
  const [hybrid, setHybrid] = useState(false);
  const [purchase, setPurchase] = useState(0);
  const [auction, setAuction] = useState(0);
  const [inland, setInland] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [importDuty, setImportDuty] = useState(0);
  const [port, setPort] = useState(0);
  const [delivery, setDelivery] = useState(0);

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  const eligibleYear = vehicleAge >= 0 && year <= currentYear;
  const ageBandValid = vehicleAge >= 0 && vehicleAge <= 6;
  const validEngine = Number.isFinite(engineCc) && engineCc > 0;

  const result = useMemo(() => {
    const baseRate = vehicleAge <= 6 ? 1.5 : 4.5;
    let rate = baseRate;
    if (steering === "right") rate *= 3;
    else if (hybrid && vehicleAge >= 0 && vehicleAge <= 6) rate *= 0.4;
    const excise = eligibleYear && validEngine ? engineCc * rate : 0;
    const nonTaxCosts = purchase + auction + inland + shipping + insurance + importDuty + port + delivery;
    return { excise, nonTaxCosts, total: excise + nonTaxCosts, rate };
  }, [vehicleAge, steering, hybrid, engineCc, eligibleYear, validEngine, purchase, auction, inland, shipping, insurance, importDuty, port, delivery]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Vehicle import planner</span>
          <h1>Price the journey, not just the car.</h1>
          <p>Build a Georgia-bound vehicle budget using your known costs and a preliminary excise estimate based on the Revenue Service's published rates effective from April 2, 2026.</p>
          <div className="hero-actions">
            <a href={revenueServiceUrl} target="_blank" rel="noreferrer" className="button button-outline">Open official Revenue Service calculator ↗</a>
            <Link href="/how-it-works" className="button button-dark">How estimates work</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container tool-layout">
          <section className="panel">
            <h2>Vehicle details</h2>
            <p className="panel-intro">This preliminary excise calculation is for passenger vehicles classified under HS 8703 and assumes the rate regime effective from April 2, 2026.</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="manufacture-year">Manufacture year</label>
                <select id="manufacture-year" value={year} onChange={(event) => setYear(Number(event.target.value))}>
                  {Array.from({ length: currentYear - 1960 + 1 }, (_, index) => currentYear - index).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <CostField id="engine-cc" label="Engine capacity (cm³)" value={engineCc} onChange={(value) => setEngineCc(Math.round(value))} hint="Use the engine capacity shown in the vehicle documents." />
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
            {(!eligibleYear || !validEngine) && <div className="notice" role="alert">Check the manufacture year and engine capacity before using this estimate.</div>}
            <div className="notice">
              <strong>Rate used:</strong> {money(result.rate)} per cm³. The estimate does not determine import eligibility or handle every vehicle classification and transitional exception.
            </div>
          </section>

          <aside className="panel result-panel" aria-live="polite">
            <span className="result-label">Preliminary excise estimate</span>
            <div className="result-total">{money(result.excise)}</div>
            <p>{eligibleYear && validEngine ? `${year} model year · ${vehicleAge} year(s) old · ${engineCc.toLocaleString("en-US")} cm³` : "Enter valid vehicle details."}</p>
            <div className="result-lines">
              <div className="result-line"><span>Excise rate</span><strong>{money(result.rate)} / cm³</strong></div>
              <div className="result-line"><span>Purchase and auction</span><strong>{money(purchase + auction)}</strong></div>
              <div className="result-line"><span>Transport and insurance</span><strong>{money(inland + shipping + insurance)}</strong></div>
              <div className="result-line"><span>Import duty entered by you</span><strong>{money(importDuty)}</strong></div>
              <div className="result-line"><span>Port and local delivery</span><strong>{money(port + delivery)}</strong></div>
              <div className="result-line result-line-total"><span>Budget including entered costs</span><strong>{money(result.total)}</strong></div>
            </div>
            <div className="disclaimer">A zero means no amount was included, not that the charge is waived or free. Import duty and service charges are not calculated here.</div>
          </aside>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Your known costs</span>
            <h2>Add the rest of the journey.</h2>
            <p>Enter each amount in GEL. Convert foreign-currency quotes using an exchange rate you have verified, then enter the GEL equivalent. Unconfirmed charges can stay at zero until you know them.</p>
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
          <p>The Georgian Revenue Service announced a changed excise model effective April 2, 2026. Its published summary states a rate of GEL 1.50 per cm³ for passenger vehicles aged up to and including six years, and GEL 4.50 per cm³ for older vehicles. Right-hand-drive or converted vehicles use three times the applicable rate. For left-hand-drive hybrids aged up to and including six years, the rate is reduced by 60%.</p>
          <p>Some vehicles may qualify for transitional treatment based on registration or transport documentation dated before April 2, 2026. The formula here does not decide whether those exceptions apply. It also does not calculate import duty, service fees, VAT treatment for unusual classifications, or special cases.</p>
          <p><strong>Before bidding or shipping, verify the exact vehicle in the official <a href={revenueServiceUrl} target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a>.</strong> If the vehicle's classification or transitional status is unclear, contact the Revenue Service.</p>
          <p>Source: <a href="https://voice.rs.ge/Default.aspx?id=3874" target="_blank" rel="noreferrer">Revenue Service notice on the April 2, 2026 tax-code change</a>. This estimate is informational, not a binding customs assessment.</p>
        </div>
      </section>
    </>
  );
}
