import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Import cost calculator",
    description: "Put the purchase price, shipping and other costs you already know in one list. The total only includes amounts you enter.",
    href: "/calculator",
    link: "Open calculator"
  },
  {
    number: "02",
    title: "Vehicle import estimate",
    description: "Enter a car's details for a preliminary estimate of selected vehicle import taxes in Georgia.",
    href: "/vehicle-import",
    link: "Estimate vehicle costs"
  },
  {
    number: "03",
    title: "Vehicle catalogue",
    description: "Look through common makes, models and engine options, then check the exact version against the car's documents.",
    href: "/vehicles",
    link: "Browse vehicles"
  },
  {
    number: "04",
    title: "Shipping checklist",
    description: "Use the checklist to compare quotes you've received and check the details before booking.",
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
            <p className="simple-status">An independent project for imports to Georgia</p>
            <h1>Planning an import to Georgia?</h1>
            <p className="simple-lede">I started Portavero because import costs are easy to lose track of. Use it to gather the figures you have, see what's still unknown and get a rough total before making a decision.</p>
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
            <p className="simple-example-foot">An example of the fields, not a real estimate.</p>
          </aside>
        </div>
      </section>

      <section className="simple-tools-section">
        <div className="container">
          <div className="simple-section-heading">
            <p className="editorial-label">TOOLS</p>
            <h2>Start with the part you know.</h2>
            <p>Use one tool or move between them as you gather more details.</p>
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
            <p className="editorial-label">BEFORE YOU DECIDE</p>
            <h2>Keep an eye on what's missing.</h2>
          </div>
          <ol>
            <li><strong>Use figures you can check.</strong><span>Start with prices from the seller or shipping company.</span></li>
            <li><strong>Don't guess at unknown costs.</strong><span>Leave them out until you have a reasonable figure.</span></li>
            <li><strong>Confirm the final amounts.</strong><span>Ask your provider or the Revenue Service about fees and taxes.</span></li>
          </ol>
        </div>
      </section>

      <section className="simple-bottom-cta">
        <div className="container">
          <h2>Already have some prices?</h2>
          <p>Add what you know now, then update the estimate when you get the missing figures.</p>
          <Link href="/calculator" className="button button-dark">Open calculator</Link>
        </div>
      </section>
    </>
  );
}
