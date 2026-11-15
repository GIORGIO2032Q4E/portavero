"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { calculateUsVinCheckDigit, validateJapaneseChassis, validateVin } from "@/lib/vin.mjs";

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
  identifier: string;
  identifierType: "vin" | "japanese-chassis";
  vehicle: DecodedVehicle;
  fields: DecodedField[];
  sources: string[];
  internationalProviderConfigured: boolean;
  cardogConfigured: boolean;
};
type ApiResponse = {
  error?: string;
  identifier?: string;
  identifierType?: string;
  quality?: "complete" | "partial";
  vehicle?: unknown;
  fields?: unknown;
  sources?: unknown;
  internationalProviderConfigured?: unknown;
  cardogConfigured?: unknown;
};

function isDecodedField(value: unknown): value is DecodedField {
  return Boolean(value) &&
    typeof value === "object" &&
    typeof (value as DecodedField).label === "string" &&
    typeof (value as DecodedField).value === "string";
}

function getImportEstimateHref(result: DecodeResult) {
  const vehicle = result.vehicle;
  const params = new URLSearchParams();
  if (result.identifierType === "vin") params.set("vin", result.identifier);

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
  const [identifierType, setIdentifierType] = useState<"vin" | "japanese-chassis">("vin");
  const [market, setMarket] = useState<"unknown" | "us">("unknown");
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkedInput = validateVin(vin);
  const expectedUsCheckDigit = identifierType === "vin" && market === "us" && checkedInput.valid
    ? calculateUsVinCheckDigit(checkedInput.vin)
    : null;
  const usCheckDigitMatches = expectedUsCheckDigit !== null &&
    checkedInput.valid &&
    expectedUsCheckDigit === checkedInput.vin[8];

  async function decodeVin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    setError("");

    const checked = identifierType === "vin"
      ? validateVin(vin)
      : validateJapaneseChassis(vin);
    if (!checked.valid) {
      setError(checked.message);
      return;
    }
    const identifier = "vin" in checked ? checked.vin : checked.chassis;

    setLoading(true);
    try {
      const response = await fetch("/api/vin-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, identifierType: identifierType === "vin" ? "vin" : "japanese-chassis" })
      });
      const rawPayload: unknown = await response.json();
      const payload: ApiResponse = rawPayload && typeof rawPayload === "object" && !Array.isArray(rawPayload)
        ? rawPayload as ApiResponse
        : {};

      if (
        !response.ok ||
        typeof payload.identifier !== "string" ||
        !payload.vehicle ||
        typeof payload.vehicle !== "object" ||
        Array.isArray(payload.vehicle) ||
        !Array.isArray(payload.fields)
      ) {
        setError(response.ok
          ? "The VIN lookup did not return a usable result. Check the number and try again."
          : typeof payload.error === "string"
            ? payload.error
            : "The VIN could not be checked. Try again.");
        return;
      }

      const fields = payload.fields.filter(isDecodedField);
      if (fields.length === 0) {
        setError("The lookup did not return any vehicle details for this VIN.");
        return;
      }

      setResult({
        quality: payload.quality === "partial" ? "partial" : "complete",
        identifier: payload.identifier,
        identifierType: payload.identifierType === "japanese-chassis" ? "japanese-chassis" : "vin",
        vehicle: payload.vehicle as DecodedVehicle,
        fields,
        sources: Array.isArray(payload.sources)
          ? payload.sources.filter((source): source is string => typeof source === "string")
          : [],
        internationalProviderConfigured: payload.internationalProviderConfigured === true,
        cardogConfigured: payload.cardogConfigured === true,
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
          <span className="eyebrow">VIN check</span>
          <h1>Identify the car. Start the import estimate.</h1>
          <p>Check a standard VIN or a Japanese domestic-market chassis number, then carry the available vehicle details into a Georgia import estimate.</p>
          <div className="hero-actions">
            <Link href="/vehicle-import" className="button button-dark">Enter car details manually ↗</Link>
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
                  <span className="eyebrow">Identify the vehicle</span>
                  <h2>Check its number</h2>
                </div>
              </div>
              <p className="panel-intro">Choose the identifier type shown on the vehicle documents. Portavero sends it only to the matching data source.</p>
              <form onSubmit={decodeVin}>
                <div className="field">
                  <label htmlFor="identifier-type">Identifier type</label>
                  <select
                    id="identifier-type"
                    value={identifierType}
                    onChange={(event) => {
                      setIdentifierType(event.target.value === "japanese-chassis" ? "japanese-chassis" : "vin");
                      setVin("");
                      setResult(null);
                      setError("");
                    }}
                    disabled={loading}
                  >
                    <option value="vin">Standard 17-character VIN</option>
                    <option value="japanese-chassis">Japanese domestic frame/chassis number</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="vin">{identifierType === "vin" ? "Vehicle identification number (VIN)" : "Japanese frame/chassis number"}</label>
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
                    maxLength={identifierType === "vin" ? 17 : 34}
                    disabled={loading}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder={identifierType === "vin" ? "e.g. 1HGCM82633A004352" : "e.g. ZRR80-0143041"}
                    aria-describedby="identifier-help"
                    required
                  />
                  {identifierType === "vin" ? (
                    <small id="identifier-help">Enter all 17 characters. Standard VINs do not use the letters I, O or Q. Do not add spaces or punctuation.</small>
                  ) : (
                    <small id="identifier-help">Enter the model/frame code and serial number with the hyphen, exactly as shown on the Japanese vehicle plate or export documents. Example: ZRR80-0143041.</small>
                  )}
                </div>

                {identifierType === "vin" && <div className="field">
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
                </div>}

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
                    {loading ? "Checking vehicle…" : identifierType === "vin" ? "Decode VIN" : "Check Japanese chassis"}
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
                  <strong>{identifierType === "vin" ? "VIN not decoded." : "Chassis number not decoded."}</strong> {error}
                </div>
              )}

              {result && (
                <div className="vin-result" aria-live="polite">
                  <div className="notice" role="status">
                    {result.identifierType === "japanese-chassis"
                      ? <><strong>Japanese chassis record found.</strong> The source may list several models or engine variants. Confirm the exact car and manufacture year from its documents.</>
                      : result.quality === "complete"
                        ? <><strong>Vehicle details found.</strong> Compare them with the car and its documents before using the estimate.</>
                        : <><strong>Only some details were found.</strong> Some vehicle specifications may be missing. Check the information below against the car's documents.</>}
                  </div>
                  <div className="result-lines">
                    {result.fields.map((field) => (
                      <div className="result-line" key={field.label}>
                        <span>{field.label}</span>
                        <strong>{field.value}</strong>
                      </div>
                    ))}
                  </div>
                  <p className="source-note">Data source{result.sources.length === 1 ? "" : "s"}: {result.sources.length > 0 ? result.sources.join(" + ") : "VIN decoder"}.</p>
                  {result.identifierType === "vin" ? (
                    <p className="source-note">The international VIN provider {result.internationalProviderConfigured ? "is configured as a fallback when the first source has gaps." : "is not configured yet. Non-U.S. VIN coverage may therefore remain limited."} Confirm all returned details against the car and its documents.</p>
                  ) : (
                    <p className="source-note">Japanese chassis details come from published MLIT recall and fuel-economy records through Cardog. The result may describe possible models and engines, not an exact trim or individual vehicle history. {result.cardogConfigured ? "The Japanese chassis provider is configured." : "The Japanese chassis provider is not configured."}</p>
                  )}
                  <p className="source-note">Identifier submitted: <code>{result.identifier}</code></p>
                  <p className="source-note">The calculator carries over only unambiguous make, model and engine details. Manufacture year, steering side and any uncertain engine variant must be confirmed from the vehicle documents.</p>
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
                  <strong>Shown when available</strong>
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
          <h2>What the lookup can return</h2>
          <p>A standard VIN may return make, model, model year, body type, engine capacity, fuel type, drive type and place of manufacture. A Japanese domestic chassis number can return model-code candidates, possible engines, type approvals and published production information when those records are available.</p>
          <p>This is not a report of accidents, ownership, title, mileage, servicing or auction history. Portavero does not search those records or show auction photos. No result does not mean the car is accident-free.</p>
          <p>Standard VINs are checked with NHTSA vPIC and can use an optional CarsXE international fallback. Japanese domestic chassis numbers use a separate optional Cardog lookup based on Japan MLIT records. Coverage varies and a record may be partial or ambiguous. Neither path searches accident, title, ownership, odometer, service or auction history, and neither guarantees a vehicle has a clean history.</p>
        </div>
      </section>
    </>
  );
}
