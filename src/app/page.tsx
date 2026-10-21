import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Import cost calculator",
    description: "Add the purchase price, shipping and other costs you know. Anything you haven't priced yet stays out of the total.",
    href: "/calculator",
    link: "Open calculator"
  },
  {
    number: "02",
    title: "Vehicle import estimate",
    description: "Enter a few details about a car to get a preliminary estimate of selected import taxes in Georgia.",
    href: "/vehicle-import",
    link: "Estimate vehicle costs"
  },
  {
    number: "03",
    title: "Vehicle catalogue",
    description: "Search common makes, models and engine variants. Check the exact details against the car's documents.",
    href: "/vehicles",
    link: "Browse vehicles"
  },
  {
    number: "04",
    title: "Shipping checklist",
    description: "Compare quotes you've received and check a few important details before booking.",
    href: "/shipping",
    link: "View checklist"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="simple-hero">
        <div className="container simple-hero-grid">
          <div className="simple-hero-copy">
            <p className="simple-status">An independent project for planning imports to Georgia</p>
            <h1>Planning an import to Georgia?</h1>
            <p className="simple-lede">I built Portavero to help keep import costs in one place. Add the amounts you know, leave unknown costs blank, and use the total as a starting point.</p>
            <div className="hero-actions">
              <Link href="/calculator" className="button button-dark">Calculate import costs</Link>
              <Link href="/vehicle-import" className="simple-text-link">Importing a car? <span aria-hidden="true">→</span></Link>
            </div>
            <p className="simple-note">Shipping prices and customs charges aren't fetched automatically.</p>
          </div>
          <aside className="simple-example">
            <div className="simple-example-heading">
              <span>EXAMPLE COST LIST</span>
              <span>USD</span>
            </div>
            <div className="simple-example-row"><span>Purchase price</span><strong>Enter amount</strong></div>
            <div className="simple-example-row"><span>Shipping</span><strong>Needs a quote</strong></div>
            <div className="simple-example-row"><span>Insurance</span><strong>Not entered</strong></div>
            <div className="simple-example-row"><span>Customs and fees</span><strong>Check first</strong></div>
            <p className="simple-example-foot">This is an example layout, not an actual estimate.</p>
          </aside>
        </div>
      </section>

      <section className="simple-tools-section">
        <div className="container">
          <div className="simple-section-heading">
            <p className="editorial-label">TOOLS</p>
            <h2>Choose what you need to work out.</h2>
            <p>Each tool covers a different part of planning an import.</p>
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
            <p className="editorial-label">A FEW THINGS TO CHECK</p>
            <h2>Before you rely on the total.</h2>
          </div>
          <ol>
            <li><strong>Enter the amounts you know.</strong><span>Use prices from your seller or shipping company.</span></li>
            <li><strong>Leave unknown costs blank.</strong><span>They won't be included until you have a figure.</span></li>
            <li><strong>Check the final numbers.</strong><span>Confirm taxes and extra fees with your provider or the Revenue Service.</span></li>
          </ol>
        </div>
      </section>

      <section className="simple-bottom-cta">
        <div className="container">
          <h2>Got a few figures already?</h2>
          <p>Add them now and update the estimate when you get more accurate quotes.</p>
          <Link href="/calculator" className="button button-dark">Open calculator</Link>
        </div>
      </section>
    </>
  );
}
