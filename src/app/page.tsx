import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Import cost calculator",
    description: "Add the costs you already know and see a subtotal, plus the amounts you still need to check.",
    href: "/calculator",
    link: "Open calculator"
  },
  {
    number: "02",
    title: "Vehicle import estimate",
    description: "Enter basic vehicle details to get a preliminary excise estimate for Georgia.",
    href: "/vehicle-import",
    link: "Estimate vehicle costs"
  },
  {
    number: "03",
    title: "Vehicle catalogue",
    description: "Browse supported makes, models and common engine variants before estimating import costs.",
    href: "/vehicles",
    link: "Browse vehicles"
  },
  {
    number: "04",
    title: "Shipping checklist",
    description: "A short list of questions to ask before accepting a shipping quote.",
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
            <p className="simple-status">Independent project · Made for import planning in Georgia</p>
            <h1>Planning an import to Georgia?</h1>
            <p className="simple-lede">Portavero helps you put the costs in one place. Enter the prices you know, keep unknown fees blank, and get a clearer starting budget.</p>
            <div className="hero-actions">
              <Link href="/calculator" className="button button-dark">Try the cost calculator</Link>
              <Link href="/vehicle-import" className="simple-text-link">Importing a car? <span aria-hidden="true">→</span></Link>
            </div>
            <p className="simple-note">No live shipping quotes or automatic customs calculations yet.</p>
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
            <p className="simple-example-foot">The example is for layout only. No prices are estimated here.</p>
          </aside>
        </div>
      </section>

      <section className="simple-tools-section">
        <div className="container">
          <div className="simple-section-heading">
            <p className="editorial-label">TOOLS</p>
            <h2>Start with the part you need.</h2>
            <p>These are small planning tools, not a freight booking service.</p>
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
            <p className="editorial-label">HOW TO USE IT</p>
            <h2>Three simple steps.</h2>
          </div>
          <ol>
            <li><strong>Enter confirmed amounts.</strong><span>Use prices from your seller or shipping company.</span></li>
            <li><strong>Leave unknown costs blank.</strong><span>That way, a missing amount is not treated as free.</span></li>
            <li><strong>Check the final numbers.</strong><span>Confirm tax rules and extra fees with official sources or your provider.</span></li>
          </ol>
        </div>
      </section>

      <section className="simple-bottom-cta">
        <div className="container">
          <h2>Start with the numbers you have.</h2>
          <p>You can update the estimate when you get more accurate quotes.</p>
          <Link href="/calculator" className="button button-dark">Open calculator</Link>
        </div>
      </section>
    </>
  );
}
