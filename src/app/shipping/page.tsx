import Link from "next/link";
import type { Metadata } from "next";
import QuoteComparison from "./quote-comparison";

export const metadata: Metadata = {
  title: "Shipping cost planning",
  description: "A checklist for reviewing a shipping quote before you book."
};

export default function ShippingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Shipping guide</span>
          <h1>What to check before you book shipping.</h1>
          <p>The price depends on the route, cargo size and weight, timing and provider. This page helps you check a quote; it does not show live shipping prices.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Ask before you book</span>
            <h2>Check what the price actually includes.</h2>
            <p>Ask what is included, what you may be charged extra for, and when the quote expires.</p>
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
            <div><h2>Got a shipping quote?</h2><p>Add it to your estimate alongside the other costs you know.</p></div>
            <Link href="/calculator" className="button button-dark">Add shipping cost <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
      <QuoteComparison />
    </>
  );
}
