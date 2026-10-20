import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping cost planning",
  description: "Review the charges, route details, and transit assumptions to confirm with a freight provider before booking."
};

import Link from "next/link";

export default function ShippingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Shipping guide</span>
          <h1>Questions to ask before shipping.</h1>
          <p>Shipping prices depend on the route, size and weight of the cargo, timing and provider. This page is a checklist, not a live price comparison.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Ask before you book</span>
            <h2>Make sure the quote covers the whole trip.</h2>
            <p>Ask providers which charges are included, what could be billed separately, and how long the quote remains valid.</p>
          </div>
          <div className="card-grid">
            {[
              ["Route and handoffs", "Confirm pickup location, destination port, transshipment points and final delivery."],
              ["What is included", "Check fuel surcharges, terminal handling, documentation, insurance and destination charges."],
              ["Timing and limits", "Ask about transit-time ranges, quote expiry, cargo dimensions and restricted goods."]
            ].map(([title, description], index) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 34 }} className="callout">
            <div><h2>Have a freight quote?</h2><p>Enter it in your cost estimate and compare it with the other known charges.</p></div>
            <Link href="/calculator" className="button button-dark">Add shipping cost <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
