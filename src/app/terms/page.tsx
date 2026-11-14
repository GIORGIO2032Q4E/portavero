import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "What Portavero is for, how its estimates work and what you should check yourself."
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Project information</span>
          <h1>Terms of use</h1>
          <p>A few things to know before using the site: what it can do, what it cannot check and where you still need official information.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <p><strong>Last updated: November 13, 2026</strong></p>

          <h2>What Portavero is for</h2>
          <p>Portavero is a student project I built to help organise the costs of bringing vehicles and other goods into Georgia. It includes a general import calculator, a limited car-tax estimate, a VIN technical-data lookup, a car comparison list and a place to compare shipping quotes you already have. It is not a customs broker, shipping company, vehicle-history service or government website.</p>

          <h2>About the numbers</h2>
          <p>The general calculator uses the costs and tax rates you enter. The car planner applies only the tax rules covered by the current version and includes a saved snapshot of standard fees. Neither tool gets a live customs assessment or guarantees what you will be charged. The vehicle list is not complete, and choosing an engine from it does not prove that it is the engine fitted to your car.</p>
          <p>The VIN lookup asks NHTSA vPIC for technical data. It does not check accident, title, ownership, mileage, service or auction history. No result does not mean the car has a clean history. The shipping page only compares the offers you enter. Portavero does not contact shipping companies or verify their prices or terms.</p>

          <h2>Please check before you make a decision</h2>
          <p>Use the results as a starting point, not as a final answer. They are not a shipping offer, official customs valuation, tax ruling, legal opinion, insurance policy or promise of the final cost. The car estimate does not cover every vehicle type, exception or transitional case. Rules, fees and provider charges can also change.</p>

          <h2>What you should check</h2>
          <p>Before buying or shipping, check your entries, the car's documents and exact engine size, its tariff classification, current fees, registration rules and the carrier's quote. For a vehicle-specific tax estimate, use the official <a href="https://www.rs.ge/CarClearance-en" target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a> or ask the Revenue Service or a qualified customs broker.</p>

          <h2>A note about the project</h2>
          <p>Portavero is a student project, not a commercial customs or shipping service. Pages and data sources may change, and the site may occasionally be unavailable. There is no dedicated support email at the moment.</p>

          <div className="notice">These terms describe the current prototype and are not a substitute for legal review before commercial use.</div>
        </div>
      </section>
    </>
  );
}
