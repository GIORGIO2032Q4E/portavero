import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Import cost calculator",
    description: "Bring the purchase price, freight, insurance, customs and local charges into one working budget.",
    href: "/calculator",
    link: "Open calculator"
  },
  {
    number: "02",
    title: "Vehicle import planner",
    description: "Build a Georgia-bound vehicle budget and check the preliminary excise estimate against official guidance.",
    href: "/vehicle-import",
    link: "Plan a vehicle import"
  },
  {
    number: "03",
    title: "Shipping checklist",
    description: "Know which charges to ask a carrier about before comparing quotes or committing to a shipment.",
    href: "/shipping",
    link: "Review shipping costs"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="editorial-hero">
        <div className="container">
          <div className="hero-kicker">
            <span>PORTAVERO / IMPORT PLANNING</span>
            <span>BUILT FOR CLEARER DECISIONS</span>
          </div>
          <div className="editorial-hero-grid">
            <div className="editorial-copy">
              <p className="editorial-label">Cross-border costs, made visible</p>
              <h1>Know what the import <em>actually costs.</em></h1>
              <p className="editorial-lede">A practical workspace for the costs between buying abroad and receiving goods in Georgia. Start with verified numbers. Keep the unknowns in view.</p>
              <div className="hero-actions">
                <Link href="/calculator" className="button button-dark">Build an estimate <span aria-hidden="true">↗</span></Link>
                <Link href="/vehicle-import" className="button button-outline">Importing a vehicle?</Link>
              </div>
              <p className="editorial-footnote"><span aria-hidden="true">01</span> No invented freight quotes. No missing costs quietly set to zero.</p>
            </div>

            <aside className="ledger-card" aria-label="Example of an import cost worksheet">
              <div className="ledger-topline">
                <span>WORKSHEET / 001</span>
                <span>ILLUSTRATIVE ONLY</span>
              </div>
              <div className="ledger-heading">
                <div>
                  <p className="ledger-overline">LANDed COST, STEP BY STEP</p>
                  <h2>Your numbers.<br />One clear picture.</h2>
                </div>
                <span className="ledger-stamp">PV<br />01</span>
              </div>
              <div className="ledger-route">
                <div className="ledger-route-point"><span className="route-node" /><span>Origin</span><strong>United States / Japan</strong></div>
                <span className="ledger-route-line" aria-hidden="true" />
                <div className="ledger-route-point"><span className="route-node route-node-end" /><span>Destination</span><strong>Georgia</strong></div>
              </div>
              <div className="ledger-table">
                <div className="ledger-row"><span>Purchase price</span><span>Enter amount</span></div>
                <div className="ledger-row"><span>International freight</span><span>Quote required</span></div>
                <div className="ledger-row"><span>Customs and clearance</span><span>Verify first</span></div>
              </div>
              <div className="ledger-bottom">
                <span>KNOWN COSTS ONLY</span>
                <span className="ledger-bottom-mark">UNKNOWN ≠ FREE</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="tool-index-section">
        <div className="container">
          <div className="tool-index-heading">
            <div>
              <p className="editorial-label">THE WORKSPACE</p>
              <h2>Tools for the decisions<br />that come before delivery.</h2>
            </div>
            <p>Import costs are spread across sellers, carriers, ports and customs. Keep each part visible before you commit.</p>
          </div>
          <div className="tool-index">
            {tools.map((tool) => (
              <article className="tool-index-row" key={tool.number}>
                <span className="tool-index-number">{tool.number}</span>
                <div className="tool-index-copy">
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                </div>
                <Link className="tool-index-link" href={tool.href}>{tool.link}<span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container process-layout">
          <div className="process-intro">
            <p className="editorial-label">A BETTER STARTING POINT</p>
            <h2>Separate what you know from what you still need to confirm.</h2>
          </div>
          <ol className="process-list">
            <li><span>01</span><div><h3>Enter confirmed costs</h3><p>Use the amounts from your seller, carrier or service provider.</p></div></li>
            <li><span>02</span><div><h3>Flag the gaps</h3><p>Leave unknown charges blank until you have a credible figure.</p></div></li>
            <li><span>03</span><div><h3>Verify before paying</h3><p>Check customs rules and final fees with the official source or provider.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="container home-cta">
          <div>
            <p className="editorial-label">START WITH WHAT YOU HAVE</p>
            <h2>Make the first estimate.<br />Improve it as facts arrive.</h2>
          </div>
          <Link href="/calculator" className="button button-light">Open the import calculator <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
