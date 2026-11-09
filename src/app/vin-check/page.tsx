"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { calculateUsVinCheckDigit, validateVin } from "@/lib/vin.mjs";

type DecodedField = { label: string; value: string };
type DecodeResult = {
  quality: "complete" | "partial";
  vin: string;
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
          <h1>Decode a vehicle identification number.</h1>
          <p>Enter a 17-character VIN to request vehicle details from the U.S. National Highway Traffic Safety Administration&apos;s vPIC decoder.</p>
          <div className="hero-actions">
            <Link href="/vehicle-import" className="button button-dark">Estimate import costs ↗</Link>
            <a href="https://vpic.nhtsa.dot.gov/decoder/" target="_blank" rel="noreferrer" className="button button-outline">Open NHTSA decoder ↗</a>
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
                  <h2>Look up technical details</h2>
                </div>
              </div>
              <p className="panel-intro">Portavero checks the VIN format, then asks NHTSA vPIC to decode it. Format checks catch typing mistakes; only the source can return manufacturer data.</p>
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
                  <small id="vin-help">17 characters. The letters I, O and Q are not used in standard VINs. Spaces and punctuation are not accepted.</small>
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
                  <small>The position-nine check digit is tested only when you select U.S. market. Other markets may use different rules.</small>
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
                      ? <><strong>Vehicle details returned.</strong> Compare the available fields with the car's documents before relying on them.</>
                      : <><strong>Partial technical data returned.</strong> NHTSA did not provide both make and model. Treat the fields below as incomplete and verify them against the vehicle documents.</>}
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
                  <Link href="/vehicle-import" className="button button-outline">Continue to import estimate ↗</Link>
                </div>
              )}
            </section>

            <aside className="panel result-panel">
              <span className="eyebrow">Know what you are seeing</span>
              <h2>Technical data is not vehicle history.</h2>
              <div className="result-lines">
                <div className="result-line">
                  <span>VIN decoding</span>
                  <strong>Available via NHTSA vPIC</strong>
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
          <h2>What the decoder can and cannot tell you</h2>
          <p>NHTSA vPIC decodes manufacturer-submitted vehicle specification data. Depending on the VIN, available fields can include make, model, model year, body class, engine information, fuel type, drive type and manufacturing location.</p>
          <p>It is not an accident, ownership, title, mileage, service or auction-history database. This version of Portavero does not query those records and does not display auction photos. Missing information is simply unavailable, not evidence that the vehicle is accident-free.</p>
          <p>NHTSA says its data is intended mainly for vehicles manufactured for sale or importation into the United States. A vehicle from another market can decode partially or not at all. Verify the VIN on the vehicle and documents, and confirm specifications with the manufacturer or seller.</p>
          <p>Source: <a href="https://vpic.nhtsa.dot.gov/api/" target="_blank" rel="noreferrer">NHTSA vPIC API documentation</a> and the <a href="https://vpic.nhtsa.dot.gov/" target="_blank" rel="noreferrer">vPIC website</a>.</p>
        </div>
      </section>
    </>
  );
}
