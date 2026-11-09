import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "Why I started Portavero and what the current version can do."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>Why I built Portavero.</h1>
          <p>The original idea was a car-import calculator. An auction price does not show what the car will cost by the time it reaches Georgia, so I wanted a place to add the other charges and see what was still missing.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>Where it started</h2>
          <p>I began with the costs around an auction car: buyer fees, transport to the export port, sea freight, customs and delivery. Those amounts usually come from different listings, quotes and documents. Portavero started as a way to keep them together. I later added a general import calculator and a few tools for checking and comparing cars.</p>

          <h2>What is in this version</h2>
          <ul>
            <li><strong>Vehicle import planner.</strong> Uses the car details you enter to estimate selected Georgian excise and import-duty amounts, then adds the costs you know.</li>
            <li><strong>VIN check.</strong> Requests available technical details from the NHTSA vPIC decoder. It does not search accident, title, mileage, ownership, service or auction records.</li>
            <li><strong>Vehicle catalogue and comparison.</strong> The catalogue lists common variants. You can save up to four cars in this browser and compare their details, costs and notes.</li>
            <li><strong>Shipping checklist.</strong> Lets you compare offers you have collected. It does not contact carriers or fetch live prices.</li>
            <li><strong>General import calculator.</strong> Adds costs and tax rates that you enter yourself, for imports other than cars.</li>
          </ul>

          <h2>How it is built</h2>
          <p>The pages use Next.js, React and TypeScript. I put the cost and vehicle-tax calculations in separate JavaScript modules so I can test the arithmetic without opening a page. The VIN form sends a request through a Next.js API route to NHTSA vPIC. Vehicle comparisons stay in the current browser. Supabase can store general estimates when its project and database table are configured.</p>

          <h2>What it does not do</h2>
          <p>Portavero does not fetch freight prices, exchange rates or customs tariff rates. The vehicle planner covers selected passenger-car cases, not every vehicle or legal exception. Its GEL 480 fee amount is a code snapshot, not a live lookup. A VIN result contains technical data only; it is not a vehicle-history report.</p>
          <p>Before relying on an estimate, check the car's documents, ask the carrier or broker what their price includes, and confirm the tax treatment with the Georgian Revenue Service.</p>
          <p>The source code, calculation modules and manual QA checklist are available in the <a href="https://github.com/GIORGIO2032Q4E/portavero" target="_blank" rel="noreferrer">Portavero GitHub repository</a>.</p>
        </div>
      </section>
    </>
  );
}
