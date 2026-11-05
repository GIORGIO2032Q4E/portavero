import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "VIN decoder",
    description: "Submit a 17-character VIN and view the technical details returned by the NHTSA vPIC decoder. It does not provide vehicle history.",
    href: "/vin-check",
    link: "Decode a VIN"
  },
  {
    number: "02",
    title: "Vehicle import estimate",
    description: "Enter a car's specifications and the costs you know to calculate a preliminary estimate for importing it into Georgia.",
    href: "/vehicle-import",
    link: "Estimate vehicle costs"
  },
  {
    number: "03",
    title: "Vehicle catalogue",
    description: "Browse selected makes, models and engine variants. Check the exact version against the vehicle documents.",
    href: "/vehicles",
    link: "Browse vehicles"
  },
  {
    number: "04",
    title: "Vehicle comparison",
    description: "Save up to four candidates in this browser and compare their entered details, costs and warnings.",
    href: "/compare",
    link: "Compare vehicles"
  },
  {
    number: "05",
    title: "Import cost calculator",
    description: "Add costs for a general import and calculate a total from the amounts and tax rates you enter.",
    href: "/calculator",
    link: "Open calculator"
  },
  {
    number: "06",
    title: "Shipping quote comparison",
    description: "Compare up to three shipping offers you have collected. Prices are ranked only against offers in the same currency.",
    href: "/shipping",
    link: "Compare shipping quotes"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="simple-hero">
        <div className="container simple-hero-grid">
          <div className="simple-hero-copy">
            <p className="simple-status">An independent vehicle-import project</p>
            <h1>Check a VIN. Estimate the cost of importing a car to Georgia.</h1>
            <p className="simple-lede">I built Portavero around two parts of researching a car before importing it: checking the technical information available from its VIN and estimating the costs of bringing it to Georgia. The tools keep source data, entered costs and details that still need checking separate.</p>
            <div className="hero-actions">
              <Link href="/vin-check" className="button button-dark">Decode a VIN</Link>
              <Link href="/vehicle-import" className="simple-text-link">Estimate vehicle import costs <span aria-hidden="true">→</span></Link>
            </div>
            <p className="simple-note">VIN results depend on the information available from NHTSA vPIC. Import estimates are preliminary, not official assessments.</p>
          </div>
          <aside className="simple-example">
            <div className="simple-example-heading">
              <span>VEHICLE IMPORT ESTIMATE</span>
              <span>GEL</span>
            </div>
            <div className="simple-example-row"><span>Vehicle details</span><strong>Check documents</strong></div>
            <div className="simple-example-row"><span>Purchase and auction</span><strong>Enter amounts</strong></div>
            <div className="simple-example-row"><span>Transport and port</span><strong>Add quotes</strong></div>
            <div className="simple-example-row"><span>Taxes and fees</span><strong>Verify result</strong></div>
            <p className="simple-example-foot">The main items to review, not a live quote.</p>
          </aside>
        </div>
      </section>

      <section className="simple-tools-section">
        <div className="container">
          <div className="simple-section-heading">
            <p className="editorial-label">TOOLS</p>
            <h2>Two main checks, with other tools to help plan the import.</h2>
            <p>Start with the vehicle information or the import estimate. The remaining tools support the process.</p>
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
            <p className="editorial-label">BEFORE YOU RELY ON A RESULT</p>
            <h2>Check what the information does and does not tell you.</h2>
          </div>
          <ol>
            <li><strong>Verify the vehicle.</strong><span>Compare decoded details with the VIN on the car and its documents.</span></li>
            <li><strong>Use costs you can support.</strong><span>Enter seller amounts and shipping quotes rather than guessing.</span></li>
            <li><strong>Confirm taxes and fees.</strong><span>Check the final calculation with the Georgian Revenue Service and your providers.</span></li>
          </ol>
        </div>
      </section>

      <section className="simple-bottom-cta">
        <div className="container">
          <h2>Have a vehicle in mind?</h2>
          <p>Start with its VIN, then use the vehicle estimator to work through the import costs.</p>
          <Link href="/vin-check" className="button button-dark">Decode a VIN</Link>
        </div>
      </section>
    </>
  );
}
