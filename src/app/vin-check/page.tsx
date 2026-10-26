"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type DecodedField = { label: string; value: string };
type DecodeResult = {
  vin: string;
  fields: DecodedField[];
  source: { name: string; url: string };
  note: string;
};
type ApiResponse = {
  error?: string;
  vin?: string;
  fields?: DecodedField[];
  source?: { name: string; url: string };
  note?: string;
  providerMessage?: string;
};

export default function VinCheckPage() {
  const [vin, setVin] = useState("");
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const payload = await response.json() as ApiResponse;

      if (!response.ok || !payload.vin || !payload.source || !payload.fields) {
        setError(payload.error || "The VIN could not be decoded. Check it and try again.");
        return;
      }

      setResult({
        vin: payload.vin,
        fields: payload.fields,
        source: payload.source,
        note: payload.note || "Technical data returned by the source."
      });
    } catch {
      setError("Could not reach the decoder. Check your connection and try again.");
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
              <p className="panel-intro">Portavero checks the input format, then asks NHTSA vPIC to decode it. A correctly shaped VIN is not proof that a vehicle exists, and some international vehicles may return limited details.</p>
              <form onSubmit={decodeVin}>
                <div className="field">
                  <label htmlFor="vin">Vehicle identification number (VIN)</label>
                  <input
                    id="vin"
                    name="vin"
                    type="text"
                    value={vin}
                    onChange={(event) => setVin(event.target.value.toUpperCase())}
                    maxLength={17}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="e.g. 1HGCM82633A004352"
                    aria-describedby="vin-help"
                    required
                  />
                  <small id="vin-help">17 letters/numbers. The letters I, O and Q are not used in standard VINs.</small>
                </div>
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
                  <div className="notice">
                    <strong>Technical data returned.</strong> The source found make/model information for this VIN. Compare these details with the vehicle documents before relying on them.
                  </div>
                  <dl className="vin-details">
                    {result.fields.map((field) => (
                      <div className="vin-detail" key={field.label}>
                        <dt>{field.label}</dt>
                        <dd>{field.value}</dd>
                      </div>
                    ))}
                  </dl>
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
