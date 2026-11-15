import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "Why I built Portavero as a car-import estimator for Georgia."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>Why I built Portavero.</h1>
          <p>When looking at an auction car, the sale price is only one part of the cost. There are also buyer fees, transport, shipping, customs and delivery. I wanted one place to put those numbers together.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>How the idea works</h2>
          <p>The main flow starts with a VIN. Portavero looks up the vehicle details available for that number, then carries them into the car-import estimate. You can check or correct those details and enter the costs from the auction and shipping quotes.</p>

          <h2>How I built it</h2>
          <p>Portavero is built with Next.js, React and TypeScript. The vehicle-tax and import-cost calculations live in separate JavaScript files, so I can test the arithmetic without opening the website. The VIN lookup runs through a Next.js server route before requesting vehicle details from an external database.</p>

          <h2>What it does not check</h2>
          <p>The VIN decoder does not provide accident, title, ownership, mileage, service or auction history. It may also return incomplete technical details for cars made for markets outside the United States. The vehicle-tax estimate covers selected passenger-car cases, and the GEL 480 standard-fee amount is a saved snapshot rather than a live lookup.</p>
          <p>Shipping prices and other costs must come from quotes or documents you have checked. Before buying or shipping a car, verify its details and tax treatment with the Georgian Revenue Service.</p>
          <p>The source code, tests and manual QA checklist are in the <a href="https://github.com/GIORGIO2032Q4E/portavero" target="_blank" rel="noreferrer">Portavero repository</a>.</p>
        </div>
      </section>
    </>
  );
}
