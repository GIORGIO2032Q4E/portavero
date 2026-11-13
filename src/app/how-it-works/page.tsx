import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the estimates work",
  description: "The calculations and data sources used by the current Portavero version."
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">How it works</span>
          <h1>What goes into an estimate.</h1>
          <p>This page describes the calculations in the current code. It is not an official customs assessment.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>Vehicle import planner</h2>
          <p>The planner uses the manufacture year, expected customs declaration year, engine capacity and vehicle configuration. Vehicle age is calculated as the declaration year minus the manufacture year.</p>
          <p>For the selected passenger-car cases covered by the current rules, the base excise rate in the code is GEL 1.50 per cm³ for ages 0–6 and GEL 4.50 per cm³ after that. The code also includes selected adjustments for right-hand-drive vehicles, eligible left-hand-drive hybrids, electric vehicles and legally classified classic cars.</p>

          <h3>One example from the current calculation</h3>
          <p>For a left-hand-drive, non-hybrid car with a 2,000 cm³ engine, manufactured in 2020 and declared in 2026, the age is six years. The current code calculates GEL 3,000 excise (2,000 × 1.50) and GEL 130 import duty (2,000 × 0.05 × (1 + 6 × 0.05)). This example shows what the application calculates for those inputs; it is not a ruling for a particular vehicle.</p>

          <h2>Other costs in the vehicle total</h2>
          <p>The planner adds the amounts entered for purchase, auction fees, inland transport, shipping, insurance, port charges and delivery. Blank fields are left out and shown as unknown. It also adds GEL 480 in standard fees recorded in the code. That amount is a snapshot, not a live Revenue Service lookup.</p>
          <p>The estimator does not decide the vehicle's tariff classification, confirm transitional eligibility or cover every exception. It also does not calculate the separate sports-car treatment in Article 188(9). Check the exact vehicle in the <a href="https://www.rs.ge/CarClearance-en" target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a>.</p>

          <h2>Other goods</h2>
          <p>The general calculator adds the costs you enter in one currency. You supply the duty and VAT/GST rates after checking the tariff code, origin and rules for the destination country. Portavero does not retrieve tax rates or convert currencies using a live exchange rate.</p>

          <h2>VIN and saved comparisons</h2>
          <p>The VIN checker sends the 17-character VIN to NHTSA vPIC and displays the technical fields returned by that service. Results can be partial, especially for vehicles built for markets outside the United States. No accident, title, odometer, ownership, service or auction-history search is performed.</p>
          <p>The comparison page saves up to four cars in the current browser. It displays the details, costs and notes you entered; it does not verify those notes or sync the list to another device.</p>

          <p><Link href="/vehicle-import" className="text-link">Open the vehicle import planner <span aria-hidden="true">↗</span></Link></p>
        </div>
      </section>
    </>
  );
}
