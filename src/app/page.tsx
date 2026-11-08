import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Import cost calculator",
    description: "Add the purchase price, freight and other charges you have. The total is based on the amounts you enter; missing costs are not filled in for you.",
    href: "/calculator",
    link: "Open calculator"
  },
  {
    number: "02",
    title: "Vehicle import estimate",
    description: "Enter a car's year, engine and configuration to estimate selected vehicle taxes in Georgia, then add the costs you know.",
    href: "/vehicle-import",
    link: "Estimate vehicle costs"
  },
  {
    number: "03",
    title: "Vehicle catalogue",
    description: "Browse a starter list of makes, models and engine variants. Check the exact engine against the car's documents.",
    href: "/vehicles",
    link: "Browse vehicles"
  },
  {
    number: "04",
    title: "Shipping checklist",
    description: "Check what a freight quote includes and compare offers you have collected before booking.",
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
            <h1>Planning to bring something into Georgia?</h1>
            <p className="simple-lede">The purchase price is only one part of an import. Freight, insurance, port charges and taxes can come from different quotes, and some figures may still be unknown. Portavero gives you one place to work through the costs and see what you still need to check.</p>
            <div className="hero-actions">
              <Link href="/calculator" className="button button-dark">Build a cost estimate</Link>
              <Link href="/vehicle-import" className="simple-text-link">Importing a car? <span aria-hidden="true">→</span></Link>
            </div>
            <p className="simple-note">Shipping prices and customs charges are not fetched automatically.</p>
          </div>
          <aside className="simple-example">
            <div className="simple-example-heading">
              <span>EXAMPLE COST LIST</span>
              <span>USD</span>
            </div>
            <div className="simple-example-row"><span>Purchase price</span><strong>Enter amount</strong></div>
            <div className="simple-example-row"><span>Shipping</span><strong>Add a quote</strong></div>
            <div className="simple-example-row"><span>Insurance</span><strong>Not entered</strong></div>
            <div className="simple-example-row"><span>Customs and fees</span><strong>Confirm first</strong></div>
            <p className="simple-example-foot">These are example fields, not a calculated quote.</p>
          </aside>
        </div>
      </section>

      <section className="simple-tools-section">
        <div className="container">
          <div className="simple-section-heading">
            <p className="editorial-label">WHAT'S IN THE PROJECT</p>
            <h2>Tools for different parts of an import.</h2>
            <p>You can use a single calculator or combine the tools as you collect more information.</p>
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
            <p className="editorial-label">BEFORE YOU RELY ON A TOTAL</p>
            <h2>Know which numbers are confirmed.</h2>
          </div>
          <ol>
            <li><strong>Start with a real price.</strong><span>Use the seller's price, invoice or auction result when you have it.</span></li>
            <li><strong>Leave missing costs out.</strong><span>An empty shipping or port charge is still an unknown, not a free service.</span></li>
            <li><strong>Check taxes and fees.</strong><span>Confirm the vehicle details and applicable charges with the Georgian Revenue Service or your broker.</span></li>
          </ol>
        </div>
      </section>

      <section className="simple-bottom-cta">
        <div className="container">
          <h2>Have one or two figures already?</h2>
          <p>Put those in first. You can come back and update the estimate when the other costs are confirmed.</p>
          <Link href="/calculator" className="button button-dark">Open calculator</Link>
        </div>
      </section>
    </>
  );
}
