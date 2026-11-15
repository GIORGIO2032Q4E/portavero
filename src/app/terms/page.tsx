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
          <p><strong>Last updated: November 15, 2026</strong></p>

          <h2>What Portavero is for</h2>
          <p>Portavero is a student-built project for planning the cost of importing a car into Georgia. You can check a VIN for available technical details, review those details, estimate selected passenger-car taxes and add purchase, auction, transport, shipping and other known costs. It is not a customs broker, shipping company, vehicle-history service or government website.</p>

          <h2>VIN information</h2>
          <p>The VIN lookup requests technical data from NHTSA vPIC and may use CarsXE's international VIN decoder as a fallback when its optional server-side API key is configured. The information can be incomplete; coverage varies by manufacturer, market and model year. It does not search accident, title, ownership, odometer, service or auction history and does not provide original auction photos. Some Japanese domestic-market vehicles use a frame or chassis number instead of a standard 17-character VIN, and those numbers are not decoded by this tool. A valid-looking VIN or an empty history result does not prove the condition or identity of a particular vehicle. Check the VIN stamped on the vehicle and compare the returned information with its documents.</p>

          <h2>Vehicle and engine catalogue</h2>
          <p>The catalogue contains common makes, models and engine variants, not every vehicle configuration sold in every market. A catalogue match is a reference for choosing inputs, not confirmation of the engine fitted to a specific car. Check the engine size, fuel system, manufacture year and steering configuration against the vehicle and its documents.</p>

          <h2>About the estimate</h2>
          <p>The vehicle-import planner uses the details and costs you enter and applies only the tax rules implemented for selected passenger-car cases. It does not determine the correct tariff classification, confirm registration eligibility, prove that transitional rules apply or cover every exception. The GEL 480 standard-fee amount is a stored snapshot, not a live fee lookup. Costs you have not entered are not included, and future tax or fee changes cannot be forecast by the current planner.</p>
          <p>The result is an informational planning estimate. It is not an official customs valuation, binding tax assessment, tax ruling, legal opinion, shipping offer, insurance policy or promise of the final landed cost.</p>

          <h2>Shipping information</h2>
          <p>The shipping guide helps you review a quote you obtain from a carrier. Any comparison uses information entered by you. Portavero does not contact shipping companies, retrieve live freight prices or verify provider prices, availability, insurance, route or terms.</p>

          <h2>Before making a purchase or shipment decision</h2>
          <p>Check the VIN on the vehicle and its documents, exact engine size and configuration, tariff classification, current tax rules, current fees, registration and vehicle eligibility requirements, and the carrier's written quote. For a vehicle-specific tax estimate, use the official <a href="https://www.rs.ge/CarClearance-en" target="_blank" rel="noreferrer">Revenue Service Auto/Moto Levy Calculator</a> or ask the Revenue Service or a qualified customs broker.</p>

          <h2>Legacy account area</h2>
          <p>The account page is retained for authentication and older saved estimates from a previous version. The current vehicle-import planner does not save estimates to that account area. The account feature has a known browser-storage session limitation and should not be used on shared or untrusted devices or for sensitive information.</p>

          <h2>About the project</h2>
          <p>Portavero is an independent student project, not a commercial customs or shipping service. Features, sources and calculations may change, and the site may occasionally be unavailable. The project does not currently publish a dedicated support email.</p>

          <div className="notice">These terms describe the current prototype and are not a substitute for legal review before commercial use.</div>
        </div>
      </section>
    </>
  );
}
