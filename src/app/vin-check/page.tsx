"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { calculateUsVinCheckDigit, validateVin } from "@/lib/vin.mjs";

type DecodedField = { label: string; value: string };
type DecodedVehicle = {
  make: string;
  model: string;
  modelYear: number | null;
  engineCc: number | null;
  primaryFuelType: string;
  secondaryFuelType: string;
  electrificationLevel: string;
  steeringLocation: string;
  steering: "" | "left" | "right";
  isElectric: boolean;
  isHybrid: boolean;
  isPlugInHybrid: boolean;
  series: string;
  trim: string;
};
type DecodeResult = {
  quality: "complete" | "partial";
  vin: string;
  vehicle: DecodedVehicle;
  fields: DecodedField[];
  source: { name: string; url: string };
  note: string;
  providerWarnings: string[];
  providerMessage?: string;
};
type ApiResponse = {
  error?: string;
  vin?: string;
  quality?: "complete" | "partial";
  vehicle?: unknown;
  fields?: unknown;
  source?: { name: string; url: string };
  note?: string;
  providerMessage?: string;
  providerWarnings?: unknown;
};

function isDecodedField(value: unknown): value is DecodedField {
  return Boolean(value) &&
    typeof value === "object" &&
    typeof (value as DecodedField).label === "string" &&
    typeof (value as DecodedField).value === "string";
}

function getImportEstimateHref(result: DecodeResult) {
  const vehicle = result.vehicle;
  const params = new URLSearchParams({ vin: result.vin });

  if (vehicle.make) params.set("make", vehicle.make);
  if (vehicle.model) params.set("model", vehicle.model);
  if (vehicle.modelYear) params.set("year", String(vehicle.modelYear));
  if (vehicle.engineCc !== null) params.set("engineCc", String(vehicle.engineCc));
  if (vehicle.primaryFuelType) params.set("fuelPrimary", vehicle.primaryFuelType);
  if (vehicle.secondaryFuelType) params.set("fuelSecondary", vehicle.secondaryFuelType);
  if (vehicle.electrificationLevel) params.set("electrification", vehicle.electrificationLevel);
  if (vehicle.steering) params.set("steering", vehicle.steering);
  if (vehicle.series) params.set("series", vehicle.series);
  if (vehicle.trim) params.set("trim", vehicle.trim);

  return `/vehicle-import?${params.toString()}`;
}

export default function VinCheckPage() {
  const [vin, setVin] = useState("");
  const [market, setMarket] = useState<"unknown" | "us">("unknown");
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkedInput = validateVin(vin);
  const expectedUsCheckDigit = market === "us" && checkedInput.valid
    ? calculateUsVinCheckDigit(checkedInput.vin)
    : null;
  const usCheckDigitMatches = expectedUsCheckDigit !== null &&
    checkedInput.valid &&
    expectedUsCheckDigit === checkedInput.vin[8];

  async function decodeVin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/vin-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin })
      });
      const rawPayload: unknown = await response.json();
      const payload: ApiResponse = rawPayload && typeof rawPayload === "object" && !Array.isArray(rawPayload)
        ? rawPayload as ApiResponse
        : {};

      const providerWarnings = Array.isArray(payload.providerWarnings)
        ? payload.providerWarnings.filter((warning): warning is string => typeof warning === "string")
        : [];
      const providerMessage = typeof payload.providerMessage === "string"
        ? payload.providerMessage
        : "";

      if (
        !response.ok ||
        typeof payload.vin !== "string" ||
        !payload.vehicle ||
        typeof payload.vehicle !== "object" ||
        Array.isArray(payload.vehicle) ||
        !payload.source ||
        typeof payload.source.name !== "string" ||
        typeof payload.source.url !== "string" ||
        !Array.isArray(payload.fields)
      ) {
        const details = [
          typeof payload.error === "string" ? payload.error : "",
          providerMessage,
          ...providerWarnings
        ].filter(Boolean).join(" ");
        setError(details || "The VIN could not be decoded. Check the number and try again.");
        return;
      }

      const fields = payload.fields.filter(isDecodedField);
      if (fields.length === 0) {
        setError("The decoder did not return any usable technical details for this VIN.");
        return;
      }

      setResult({
        quality: payload.quality === "partial" ? "partial" : "complete",
        vin: payload.vin,
        vehicle: payload.vehicle as DecodedVehicle,
        fields,
        source: payload.source,
        note: typeof payload.note === "string" ? payload.note : "Technical data returned by the source.",
        providerWarnings,
        providerMessage
      });
    } catch {
      setError("Could not complete the request. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">VIN check · Technical data</span>
          <h1>Check a VIN. Start the car import estimate.</h1>
          <p>Portavero asks the NHTSA vPIC decoder for manufacturer-reported vehicle details, then carries the available specifications into the Georgian import calculator. Results can be incomplete, depending on the vehicle.</p>
          <div className="hero-actions">
            <Link href="/vehicle-import" className="button button-dark">Enter car details manually ↗</Link>
            <a href="https://vpic.nhtsa.dot.gov/decoder/" target="_blank" rel="noreferrer" className="button button-outline">Open NHTSA's VIN decoder ↗</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tool-layout">
            <section className="panel vehicle-panel">
              <div className="vehicle-section-heading">
                <span className="step-chip">01</span>
                <div>
                  <span className="eyebrow">Enter the VIN</span>
                  <h2>Check the VIN</h2>
                </div>
              </div>
              <p className="panel-intro">First, Portavero checks the VIN format for typing mistakes. Then it sends the number to NHTSA vPIC and shows whatever manufacturer data comes back.</p>
              <form onSubmit={decodeVin}>
                <div className="field">
                  <label htmlFor="vin">Vehicle identification number (VIN)</label>
                  <input
                    id="vin"
                    name="vin"
                    type="text"
                    value={vin}
                    onChange={(event) => {
                      setVin(event.target.value.toUpperCase());
                      setResult(null);
                      setError("");
                    }}
                    maxLength={17}
                    disabled={loading}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="e.g. 1HGCM82633A004352"
                    aria-describedby="vin-help"
                    required
                  />
                  <small id="vin-help">Enter all 17 characters. Standard VINs do not use the letters I, O or Q. Do not add spaces or punctuation.</small>
                </div>

                <div className="field">
                  <label htmlFor="vin-market">Vehicle market for check-digit test</label>
                  <select
                    id="vin-market"
                    value={market}
                    onChange={(event) => setMarket(event.target.value === "us" ? "us" : "unknown")}
                  >
                    <option value="unknown">Not sure / another market</option>
                    <option value="us">Built for the U.S. market</option>
                  </select>
                  <small>The ninth character is checked only when you choose U.S. market. VIN rules can differ in other markets.</small>
                </div>

                {expectedUsCheckDigit !== null && (
                  <div className="notice" role="status">
                    {usCheckDigitMatches
                      ? "The U.S. check-digit calculation matches position 9."
                      : `The U.S. check-digit calculation expects "${expectedUsCheckDigit}" in position 9, but the entered VIN has "${checkedInput.valid ? checkedInput.vin[8] : ""}". Check the number against the vehicle and documents.`}
                    {" "}This is a transcription check, not proof that a VIN or vehicle is genuine.
                  </div>
                )}

                <div className="hero-actions">
                  <button type="submit" className="button button-dark" disabled={loading}>
                    {loading ? "Checking VIN…" : "Decode VIN"}
                  </button>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => { setVin(""); setResult(null); setError(""); }}
                    disabled={loading}
                  >
                    Clear
                  </button>
                </div>
              </form>

              {error && (
                <div className="notice" role="alert">
                  <strong>VIN not decoded.</strong> {error}
                </div>
              )}

              {result && (
                <div className="vin-result" aria-live="polite">
                  <div className="notice" role="status">
                    {result.quality === "complete"
                      ? <><strong>NHTSA returned vehicle details.</strong> Compare the available fields with the car's documents before relying on them.</>
                      : <><strong>NHTSA returned only part of the information.</strong> It did not provide both the make and model, so check the details below against the car's documents.</>}
                  </div>
                  {result.providerWarnings.length > 0 && (
                    <div className="notice" role="alert">
                      <strong>NHTSA decoder warning:</strong> {result.providerWarnings.join(" ")}
                    </div>
                  )}
                  {result.providerMessage && <p className="source-note">NHTSA message: {result.providerMessage}</p>}
                  <div className="result-lines">
                    {result.fields.map((field) => (
                      <div className="result-line" key={field.label}>
                        <span>{field.label}</span>
                        <strong>{field.value}</strong>
                      </div>
                    ))}
                  </div>
                  <p className="source-note">{result.note} Source: <a href={result.source.url} target="_blank" rel="noreferrer">{result.source.name}</a>.</p>
                  <p className="source-note">VIN submitted: <code>{result.vin}</code></p>
                  <p className="source-note">The calculator will carry over the decoded make, model, year, engine size, fuel system and steering location when NHTSA provides them. You only need to confirm details the decoder could not identify.</p>
                  <Link href={getImportEstimateHref(result)} className="button button-dark">Continue to this car’s import estimate ↗</Link>
                </div>
              )}
            </section>

            <aside className="panel result-panel">
              <span className="eyebrow">Know what you are seeing</span>
              <h2>A VIN decode is not a vehicle-history report.</h2>
              <div className="result-lines">
                <div className="result-line">
                  <span>VIN decoding</span>
                  <strong>Available from NHTSA vPIC</strong>
                </div>
                <div className="result-line">
                  <span>Accident, title and ownership records</span>
                  <strong>Not searched</strong>
                </div>
                <div className="result-line">
                  <span>Auction records and original photos</span>
                  <strong>Not connected</strong>
                </div>
                <div className="result-line">
                  <span>Odometer / service history</span>
                  <strong>Not available here</strong>
                </div>
              </div>
              <div className="disclaimer">
                Portavero does not create or guess history records or vehicle photos. No history result is returned by this tool, so it must not be read as a clean history.
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container content-narrow prose">
          <h2>What you can get from a VIN</h2>
          <p>NHTSA vPIC reads vehicle information submitted by manufacturers. Depending on the VIN, it may return the make, model, model year, body type, engine, fuel type, drive type and place of manufacture.</p>
          <p>This is not a report of accidents, ownership, title, mileage, servicing or auction history. Portavero does not search those records or show auction photos. No result does not mean the car is accident-free.</p>
          <p>NHTSA's database is mainly intended for vehicles made for sale or import into the United States. A car from another market may return only a few details, or none at all. Check the VIN on the car and its documents, and confirm the specifications with the seller or manufacturer.</p>
          <p>Source: <a href="https://vpic.nhtsa.dot.gov/api/" target="_blank" rel="noreferrer">NHTSA vPIC API documentation</a> and the <a href="https://vpic.nhtsa.dot.gov/" target="_blank" rel="noreferrer">vPIC website</a>.</p>
        </div>
      </section>
    </>
  );
}
