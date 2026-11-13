import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The purpose and limits of the Portavero import-planning prototype."
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Project information</span>
          <h1>Terms of use</h1>
          <p>These notes explain what the current Portavero prototype is for and what its estimates do not cover.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <p><strong>Last updated: November 13, 2026</strong></p>

          <h2>Purpose</h2>
          <p>Portavero is an independent student project for organising estimated import costs for goods and vehicles brought into Georgia. It includes a general cost calculator, a limited vehicle-tax estimator, a technical VIN lookup, a browser-based vehicle comparison and a manual shipping quote comparison. It is not a customs broker, shipping carrier, vehicle-history provider or government service.</p>

          <h2>Estimates and information</h2>
          <p>General import totals use amounts and tax rates entered by the user. The vehicle planner applies a limited set of rules stored in the project code and includes a snapshot of listed standard fees. Neither calculator retrieves a live customs assessment or guarantees the amount that will be charged. The vehicle catalogue is incomplete, and a selected catalogue variant does not confirm the engine fitted to an individual car.</p>
          <p>The VIN lookup requests technical data from NHTSA vPIC. It does not search accident, title, ownership, odometer, service or auction history. A missing history result is not evidence that a vehicle has a clean history. The shipping page compares offers entered by the user; Portavero does not contact providers or verify their prices or terms.</p>

          <h2>Not official advice or a binding quote</h2>
          <p>Results are for planning and educational purposes. They are not a binding transport offer, official customs valuation, tax ruling, legal opinion, insurance policy or guarantee of final cost. The vehicle estimator does not cover every vehicle classification, exception or transitional case. Laws, fees, eligibility rules and provider charges can change.</p>

          <h2>Your responsibility</h2>
          <p>Check your inputs, vehicle documents, exact engine capacity, tariff classification, current fees, registration eligibility, carrier quote and import requirements before making a purchase or shipping decision. For a vehicle-specific tax estimate, consult the official <a href="https://www.rs.ge/CarClearance-en" target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a> or ask the Revenue Service or a qualified customs broker.</p>

          <h2>Availability and changes</h2>
          <p>This is a student project, not a commercial customs or shipping service. Pages and data sources may change, and the site may be unavailable at times. There is no dedicated support email or guaranteed uptime.</p>

          <h2>Contact</h2>
          <p>This student-developed project prototype does not currently have a dedicated support email address.</p>

          <div className="notice">These terms describe the current prototype and are not a substitute for legal review before commercial use.</div>
        </div>
      </section>
    </>
  );
}
