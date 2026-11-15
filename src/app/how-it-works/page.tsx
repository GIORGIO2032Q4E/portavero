import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the estimates work",
  description: "How Portavero uses VIN details and user-entered costs to estimate a car import to Georgia."
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">How it works</span>
          <h1>From VIN to an import estimate.</h1>
          <p>Portavero uses available vehicle details as a starting point, then adds the costs you enter. The result is a planning estimate, not an official customs assessment.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>1. Check the VIN</h2>
          <p>Enter the car's 17-character VIN. Portavero looks up the details available for that number, such as make, model, model year and engine capacity.</p>
          <p>The lookup is more reliable for vehicles made for the United States market. Details for cars built for other markets may be incomplete or unavailable. A VIN lookup is not an accident, title, mileage, ownership, service or auction-history report.</p>

          <h2>2. Use those details in the estimate</h2>
          <p>After decoding, continue to the car-import planner. Available make, model, year and engine displacement are carried into the form when they are available. Check every value against the car's documents. If the engine size is missing, enter it yourself. Steering side must also be selected because the lookup may not identify it.</p>

          <h2>3. Add the import costs</h2>
          <p>Add the purchase price, auction fees, transport to the export port, international shipping, insurance, port charges and local delivery. Enter amounts in GEL using an exchange rate you have checked. Leave unknown costs blank; a blank amount is not treated as free.</p>

          <h2>How the vehicle taxes are estimated</h2>
          <p>For the selected passenger-car cases covered by the current rules, the base excise rate is GEL 1.50 per cm³ for cars aged 0–6 years and GEL 4.50 per cm³ for older cars. The calculation also includes certain adjustments for right-hand drive, eligible left-hand-drive hybrids, electric cars and cars legally classified as classics.</p>
          <p>For example, a left-hand-drive, non-hybrid car with a 2,000 cm³ engine, made in 2020 and declared in 2026, is treated as six years old. The current calculation gives GEL 3,000 in excise (2,000 × 1.50) and GEL 130 in import duty (2,000 × 0.05 × (1 + 6 × 0.05)). This is an example of the formula, not a decision about a specific car.</p>
          <p>The estimate also includes GEL 480 in standard listed fees. That amount is stored in the code, not fetched live. The planner does not determine tariff classification, confirm transitional eligibility or cover every exception, including the separate sports-car treatment in Article 188(9). Check the exact car with the <a href="https://www.rs.ge/CarClearance-en" target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a>.</p>

          <p><Link href="/vin-check" className="text-link">Start with a VIN <span aria-hidden="true">↗</span></Link></p>
        </div>
      </section>
    </>
  );
}
