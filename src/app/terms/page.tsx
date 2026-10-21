import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The purpose, limitations and responsibilities associated with using Portavero's import-planning prototype."
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero"><div className="container"><span className="eyebrow">Project information</span><h1>Terms of use</h1><p>These terms describe the intended use and current limitations of the Portavero project prototype.</p></div></section>
      <section className="section"><div className="container content-narrow prose">
        <p><strong>Last updated: October 21, 2026</strong></p>
        <h2>Purpose</h2><p>Portavero is a project prototype for organizing estimated import costs for goods and vehicles brought into Georgia. It is not a customs broker, shipping carrier or government service.</p>
        <h2>Estimates are not official quotes or tax advice</h2><p>The calculators organize values entered by the user and apply a limited set of planning rules. Results are not a binding shipping offer, official customs valuation, tax ruling, legal opinion or guarantee of the final cost. The vehicle estimate does not cover every vehicle classification, fee or transitional case. Actual costs may differ because of provider charges, exchange rates, classification, eligibility requirements or changes in law.</p>
        <h2>Your responsibility</h2><p>You are responsible for checking your inputs and confirming carrier quotes, duties, taxes, import eligibility, emissions requirements, documentation and other conditions with the relevant providers and authorities before purchasing or shipping goods. For a vehicle-specific tax estimate, consult the official Revenue Service calculator linked from the website.</p>
        <h2>Availability and changes</h2><p>The project is provided for demonstration and educational purposes. It may change, become unavailable or contain errors, and no service-level commitment is offered.</p>
        <h2>Contact</h2><p>This student-developed project prototype does not currently have a dedicated support email address.</p>
        <div className="notice">These terms describe the current prototype and are not a substitute for legal review before commercial use.</div>
      </div></section>
    </>
  );
}
