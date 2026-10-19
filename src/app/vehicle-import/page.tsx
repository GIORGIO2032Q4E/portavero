import Link from "next/link";

const checklist = [
  ["Vehicle purchase", "Auction or seller price, buyer fees and inland transport to the export point."],
  ["International transport", "Ocean freight or other transport, insurance, and any port or handling charges."],
  ["Arrival and clearance", "Port storage, terminal handling, customs broker and local delivery if applicable."],
  ["Taxes and compliance", "Confirm the current treatment for your exact vehicle, engine, age, fuel type and import purpose."]
];

export default function VehicleImportPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Vehicle import planner</span>
          <h1>Price the journey, not just the car.</h1>
          <p>Organize the costs of bringing a vehicle to Georgia, from purchase and inland transport to shipping and arrival charges. Official customs and tax treatment must be checked for the specific vehicle.</p>
          <div className="hero-actions">
            <Link href="/calculator" className="button button-dark">Start an estimate <span aria-hidden="true">↗</span></Link>
            <Link href="/how-it-works" className="button button-outline">How estimates work</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Build the full picture</span>
            <h2>Four cost groups to check.</h2>
            <p>Vehicle imports involve different fees depending on the route, provider, vehicle and current rules. Treat this as a checklist, not a quote.</p>
          </div>
          <div className="card-grid">
            {checklist.map(([title, description], index) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 30 }} className="notice">
            <strong>Important for Georgia:</strong> this page does not calculate official vehicle import taxes yet. Verify the latest rules with the Georgian Revenue Service before bidding or purchasing. Do not rely on an unverified online estimate for a customs decision.
          </div>
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <div className="callout">
            <div><h2>Already have a purchase price?</h2><p>Add your known transport and fee estimates to the general calculator.</p></div>
            <Link href="/calculator" className="button button-dark">Open calculator <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
