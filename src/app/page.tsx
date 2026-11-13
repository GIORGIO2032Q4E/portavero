import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Vehicle import estimate",
    description: "Enter the car's year, engine capacity and configuration, then add the purchase, auction and transport costs you know. The tax rules cover selected cases only.",
    href: "/vehicle-import",
    link: "Estimate car costs"
  },
  {
    number: "02",
    title: "VIN check",
    description: "Request available technical details from NHTSA vPIC. It can return specifications, but it does not provide accident or auction history.",
    href: "/vin-check",
    link: "Check a VIN"
  },
  {
    number: "03",
    title: "Compare vehicles",
    description: "Save up to four cars in this browser and compare their specifications, entered costs and your own notes.",
    href: "/compare",
    link: "Compare cars"
  },
  {
    number: "04",
    title: "Vehicle catalogue",
    description: "Browse a short list of common makes, models and engine options. Confirm the exact engine from the car's documents.",
    href: "/vehicles",
    link: "Browse the catalogue"
  },
  {
    number: "05",
    title: "Shipping checklist",
    description: "Compare freight offers you have received and check what each one includes. No live carrier prices are connected.",
    href: "/shipping",
    link: "Review shipping offers"
  },
  {
    number: "06",
    title: "General import calculator",
    description: "For other goods, add the costs and tax rates you have checked. The calculator does not look up tariff rates for you.",
    href: "/calculator",
    link: "Calculate other imports"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="simple-hero">
        <div className="container simple-hero-grid">
          <div className="simple-hero-copy">
            <p className="simple-status">A student project about car imports to Georgia</p>
            <h1>Estimate what it may cost to bring a car to Georgia.</h1>
            <p className="simple-lede">An auction price is not the full cost. Buyer fees, inland transport, shipping, customs and delivery come later. I built Portavero to put those amounts in one estimate. Add a figure when you can confirm it; blank fields stay out of the total.</p>
            <div className="hero-actions">
              <Link href="/vehicle-import" className="button button-dark">Estimate a car import</Link>
              <Link href="/calculator" className="simple-text-link">Importing other goods? <span aria-hidden="true">→</span></Link>
            </div>
            <p className="simple-note">No live shipping quotes, exchange rates or automatic customs-rate lookup.</p>
          </div>
          <aside className="simple-example">
            <div className="simple-example-heading">
              <span>CAR IMPORT COSTS</span>
              <span>GEL</span>
            </div>
            <div className="simple-example-row"><span>Car price</span><strong>Enter amount</strong></div>
            <div className="simple-example-row"><span>Auction fees</span><strong>Add if known</strong></div>
            <div className="simple-example-row"><span>Shipping</span><strong>Quote needed</strong></div>
            <div className="simple-example-row"><span>Customs charges</span><strong>Check with RS</strong></div>
            <p className="simple-example-foot">Example fields only. This is not a quote.</p>
          </aside>
        </div>
      </section>

      <section className="simple-tools-section">
        <div className="container">
          <div className="simple-section-heading">
            <p className="editorial-label">THE CURRENT TOOLS</p>
            <h2>Vehicle import comes first.</h2>
            <p>The planner is the main part of Portavero. The other pages let you check technical VIN data, browse common engine variants, compare cars or estimate the cost of importing other goods.</p>
          </div>
          <div className="simple-tool-list">
            {tools.map((tool) => (
              <article className="simple-tool-row" key={tool.number}>
                <span className="simple-tool-number">{tool.number}</span>
                <div>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                </div>
                <Link href={tool.href}>{tool.link} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="simple-how-section">
        <div className="container simple-how-grid">
          <div>
            <p className="editorial-label">BEFORE YOU USE A RESULT</p>
            <h2>Three things to check.</h2>
          </div>
          <ol>
            <li><strong>Check the car.</strong><span>Use the engine capacity and year from the vehicle documents where possible.</span></li>
            <li><strong>Add the costs you have.</strong><span>Leave shipping, port or broker charges blank until you have a quote.</span></li>
            <li><strong>Verify the tax result.</strong><span>The planner covers selected cases. Check the vehicle with the Georgian Revenue Service before buying or shipping.</span></li>
          </ol>
        </div>
      </section>

    </>
  );
}
