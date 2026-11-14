import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the estimates work",
  description: "A plain explanation of what Portavero calculates, where the numbers come from and what still needs checking."
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">How it works</span>
          <h1>How Portavero works out the estimate.</h1>
          <p>Here is what the current version includes. The result is a planning estimate, not an official customs assessment.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>Vehicle import planner</h2>
          <p>For the car estimate, enter the manufacture year, the year you expect to declare it, engine size and a few details such as steering side and fuel type. The planner works out the car's age by subtracting its manufacture year from the declaration year.</p>
          <p>For the passenger-car cases covered by the current rules, the base excise rate is GEL 1.50 per cm³ for cars aged 0–6 years and GEL 4.50 per cm³ for older cars. The calculation also includes certain adjustments for right-hand drive, eligible left-hand-drive hybrids, electric cars and cars legally classified as classics.</p>

          <h3>An example</h3>
          <p>Take a left-hand-drive, non-hybrid car with a 2,000 cm³ engine, made in 2020 and declared in 2026. The planner treats it as six years old. With those details, it calculates GEL 3,000 in excise (2,000 × 1.50) and GEL 130 in import duty (2,000 × 0.05 × (1 + 6 × 0.05)). That is an example of the formula, not a decision about a specific car.</p>

          <h2>Other costs in the vehicle total</h2>
          <p>The planner adds the costs you enter: purchase price, auction fees, inland transport, shipping, insurance, port charges and delivery. A blank field is treated as unknown, not as zero. The calculation also includes GEL 480 in standard fees. That figure is stored in the code, so check the Revenue Service for the current amount.</p>
          <p>The planner cannot decide a vehicle's tariff classification, confirm that it qualifies for transitional rules or cover every exception. It also does not include the separate sports-car treatment in Article 188(9). Check the exact car with the <a href="https://www.rs.ge/CarClearance-en" target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a>.</p>

          <h2>Other goods</h2>
          <p>The general calculator adds the costs you enter, as long as they are all in the same currency. You need to check the tariff code, country of origin and destination rules, then enter the correct duty and VAT/GST rates yourself. Portavero does not look up rates or convert currencies using a live exchange rate.</p>

          <h2>VIN and saved comparisons</h2>
          <p>Enter a 17-character VIN and the checker asks NHTSA vPIC for the technical details it has. Some results may be incomplete, especially for cars made for markets outside the United States. It does not search accident, title, mileage, ownership, service or auction records.</p>
          <p>You can save up to four cars in the browser you are using and compare their details, costs and your notes. Those notes are not checked, and the list does not sync to another device.</p>

          <p><Link href="/vehicle-import" className="text-link">Open the vehicle import planner <span aria-hidden="true">↗</span></Link></p>
        </div>
      </section>
    </>
  );
}
