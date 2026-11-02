"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  parseSavedVehicleCandidates,
  SAVED_VEHICLES_STORAGE_KEY,
  type SavedVehicleCandidate
} from "@/lib/saved-vehicles.mjs";

const money = (value: number | null) => value === null
  ? "Not entered"
  : new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GEL",
      maximumFractionDigits: 2
    }).format(value);

const costRows: { key: keyof SavedVehicleCandidate["costs"]; label: string }[] = [
  { key: "purchase", label: "Purchase price" },
  { key: "auction", label: "Auction / buyer fees" },
  { key: "inland", label: "Origin inland transport" },
  { key: "shipping", label: "International shipping" },
  { key: "insurance", label: "Insurance" },
  { key: "port", label: "Port, broker and storage" },
  { key: "delivery", label: "Local delivery" }
];

export default function CompareVehiclesPage() {
  const [candidates, setCandidates] = useState<SavedVehicleCandidate[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = parseSavedVehicleCandidates(
        window.localStorage.getItem(SAVED_VEHICLES_STORAGE_KEY)
      );
      setCandidates(saved.items);
      if (saved.skipped) {
        setMessage("Some saved entries were skipped because their data was incomplete or unsupported.");
      }
    } catch {
      setMessage("Could not read saved vehicles in this browser.");
    }
  }, []);

  function saveChanges(next: SavedVehicleCandidate[]) {
    try {
      window.localStorage.setItem(SAVED_VEHICLES_STORAGE_KEY, JSON.stringify(next));
      setCandidates(next);
      setMessage("");
      return true;
    } catch {
      setMessage("Could not update browser storage. Your comparison list was not changed.");
      return false;
    }
  }

  function removeCandidate(id: string) {
    saveChanges(candidates.filter((candidate) => candidate.id !== id));
  }

  function clearCandidates() {
    saveChanges([]);
  }

  function row(label: string, render: (candidate: SavedVehicleCandidate) => ReactNode) {
    return (
      <tr key={label}>
        <th scope="row">{label}</th>
        {candidates.map((candidate) => (
          <td key={candidate.id}>{render(candidate)}</td>
        ))}
      </tr>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Vehicle shortlist</span>
          <h1>Compare the cars you are considering.</h1>
          <p>Review the specifications, notes, estimated import costs and visible risks side by side. Missing information stays marked as unknown.</p>
          <div className="hero-actions">
            <Link href="/vehicle-import" className="button button-dark">Add a vehicle to compare ↗</Link>
            <Link href="/vehicles" className="button button-outline">Browse vehicle catalogue</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {message && <p className="estimate-save-message" role="status">{message}</p>}

          {candidates.length === 0 ? (
            <div className="panel catalog-empty">
              <h2>Your comparison list is empty.</h2>
              <p>Open the vehicle import planner, enter a car and its known costs, then choose “Save for comparison”. You can keep up to four candidates in this browser.</p>
              <Link href="/vehicle-import" className="button button-dark">Start with a vehicle ↗</Link>
            </div>
          ) : (
            <>
              <div className="compare-toolbar">
                <p>{candidates.length} of 4 vehicles saved in this browser.</p>
                <button type="button" className="button button-outline button-small" onClick={clearCandidates}>Clear comparison list</button>
              </div>

              {candidates.length === 1 && (
                <div className="notice compare-notice">
                  Save at least one more vehicle to compare candidates side by side.
                </div>
              )}

              <div className="compare-table-wrap" role="region" aria-label="Saved vehicle comparison" tabIndex={0}>
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th scope="col">Comparison</th>
                      {candidates.map((candidate) => (
                        <th scope="col" key={candidate.id}>
                          <div className="compare-candidate-heading">
                            <strong>{candidate.name}</strong>
                            <small>Saved {new Date(candidate.savedAt).toLocaleDateString()}</small>
                            <button type="button" className="button button-outline button-small" onClick={() => removeCandidate(candidate.id)}>
                              Remove
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {row("Make and model", (candidate) => `${candidate.make} ${candidate.model}`)}
                    {row("Manufacture year", (candidate) => String(candidate.year))}
                    {row("Engine / powertrain", (candidate) => (
                      <>
                        <strong>{candidate.engineLabel}</strong>
                        <small className="compare-detail">{candidate.fuel} · {candidate.engineCc.toLocaleString("en-US")} cm³</small>
                        <small className="compare-detail">{candidate.engineVerified ? "Catalogue variant selected; confirm against documents." : "Manual entry; confirm against documents."}</small>
                      </>
                    ))}
                    {row("Purchase country", (candidate) => candidate.sourceCountry)}
                    {row("Steering and configuration", (candidate) => (
                      <>
                        {candidate.steering === "right" ? "Right-hand drive / converted" : "Left-hand drive"}
                        <small className="compare-detail">{candidate.isElectric ? "Electric" : candidate.hybrid ? "Hybrid" : candidate.fuel}</small>
                        {candidate.classicCar && <small className="compare-detail">Classic-car rate selected</small>}
                      </>
                    ))}
                    {row("Declaration year / vehicle age", (candidate) => `${candidate.declarationYear} · ${candidate.declarationYear - candidate.year} years`)}
                    {row("VIN recorded", (candidate) => candidate.vin
                      ? <><code>{candidate.vin}</code><small className="compare-detail">Recorded only. Not decoded on this page.</small></>
                      : "Not added")}
                    {row("Known history / condition", (candidate) => candidate.historyNotes
                      ? <><strong>User-entered notes (not verified)</strong><p className="compare-history-notes">{candidate.historyNotes}</p></>
                      : "No details recorded. This is unknown, not a clean-history result.")}
                    {costRows.map((cost) => row(cost.label, (candidate) => money(candidate.costs[cost.key])))}
                    {row("Entered expenses subtotal", (candidate) => money(candidate.knownCosts))}
                    {row("Estimated excise", (candidate) => money(candidate.excise))}
                    {row("Estimated import duty", (candidate) => money(candidate.importDuty))}
                    {row("Standard listed fees", (candidate) => money(candidate.officialFees))}
                    {row("Known-cost estimate so far", (candidate) => (
                      <strong className="compare-total">{money(candidate.estimatedTotal)}</strong>
                    ))}
                    {row("Additional costs not entered", (candidate) => `${candidate.unknownCosts} of 7 categories`)}
                    {row("Registration check", (candidate) => candidate.registrationRestricted
                      ? <span className="compare-risk">Restriction flagged. Check official rules and exceptions.</span>
                      : "No general age restriction flagged by this calculator. Verify eligibility officially.")}
                    {row("Risks to review", (candidate) => (
                      <ul className="compare-risk-list">
                        {candidate.riskReasons.map((risk, index) => <li key={index}>{risk}</li>)}
                      </ul>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="compare-footnote">The estimate includes the amounts entered, the calculator’s preliminary tax estimates and GEL 480 in listed standard fees. Blank cost categories are excluded, so this is not a guaranteed final landed cost. VIN format and user-entered history notes are not proof of vehicle condition or legal status.</p>
            </>
          )}
        </div>
      </section>

      <section className="section section-tint">
        <div className="container content-narrow prose">
          <h2>What “history” means here</h2>
          <p>Portavero currently does not connect to accident, title, odometer, service or auction-history databases. The comparison shows notes you entered yourself and labels them as unverified. A VIN can be recorded, but this page does not run the NHTSA decoder automatically or turn missing records into a clean-history claim.</p>
          <p>Saved candidates stay in this browser on this device. They are not synced to your Portavero account or another device.</p>
        </div>
      </section>
    </>
  );
}
