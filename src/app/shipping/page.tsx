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
          <p>The price of shipping a car depends on the route, vehicle size, timing and provider. This page helps you check a quote; it does not show live shipping prices.</p>
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
              ["Pickup, route and delivery", "Check where the car will be collected, which ports it will pass through and where it will be delivered."],
              ["Extra charges", "Ask about fuel surcharges, port handling, paperwork, insurance and fees due at the destination."],
              ["Timing and cargo limits", "Ask how long the trip may take, when the price expires, and whether the vehicle meets the carrier's requirements."]
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
            <Link href="/vehicle-import" className="button button-dark">Add shipping cost <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
      <QuoteComparison />
    </>
  );
}
