import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Import cost calculator",
    description: "Bring product price, shipping, insurance and extra charges into one clear estimate.",
    href: "/calculator",
    link: "Calculate your landed cost"
  },
  {
    number: "02",
    title: "Vehicle import planning",
    description: "Organize a vehicle's purchase price, transport, port costs and other known expenses.",
    href: "/vehicle-import",
    link: "Plan a vehicle import"
  },
  {
    number: "03",
    title: "Shipping quote checklist",
    description: "Review the charges a freight quote should cover and identify details to confirm before booking.",
    href: "/shipping",
    link: "Explore shipping costs"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">A clearer way to import</span>
            <h1>Know the full cost <em>before you import.</em></h1>
            <p>Plan your next cross-border shipment with the costs in one place, the assumptions in plain sight, and fewer expensive surprises.</p>
            <div className="hero-actions">
              <Link href="/calculator" className="button button-dark">Calculate import cost <span aria-hidden="true">↗</span></Link>
              <Link href="/vehicle-import" className="button button-outline">Explore vehicle import</Link>
            </div>
            <div className="trust-note"><span className="trust-dot" /> Estimates you can inspect. No made-up live rates.</div>
          </div>
          <div className="hero-art" aria-label="Illustration of an import route and cost summary">
            <div className="float-note note-top">One clear estimate<span>Costs in one place</span></div>
            <div className="route-card">
              <div className="route-card-top">
                <div><div className="route-label">Import overview</div><div className="route-title">From purchase to arrival</div></div>
                <span className="status-label">Planning mode</span>
              </div>
              <div className="route-map">
                <div className="route-path" /><span className="map-point" /><span className="map-point end" />
                <div className="map-caption"><span>Origin</span><span>Destination</span></div>
              </div>
              <div className="route-stats">
                <div className="route-stat"><span>Costs included</span><strong>Line by line</strong></div>
                <div className="route-stat"><span>Data source</span><strong>Your inputs</strong></div>
              </div>
            </div>
            <div className="float-note note-bottom">See what is known<span>And what still needs a quote</span></div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Your import toolkit</span>
            <h2>Less guesswork. More visibility.</h2>
            <p>Import costs can hide in the gaps between suppliers, shipping companies and customs. Portavero gives those moving parts a place to meet.</p>
          </div>
          <div className="card-grid">
            {tools.map((tool) => (
              <article className="feature-card" key={tool.number}>
                <span className="feature-icon">{tool.number}</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <Link className="text-link" href={tool.href}>{tool.link} <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">The process</span>
            <h2>Three steps. A much clearer picture.</h2>
            <p>Start with what you know. Add real quotes as you get them. Keep unknown costs visible instead of quietly pretending they are zero.</p>
          </div>
          <div className="steps-grid">
            <article className="step"><span className="step-number">STEP 01</span><h3>Enter the basics</h3><p>Add your item value, currency, shipping and any known fees.</p></article>
            <article className="step"><span className="step-number">STEP 02</span><h3>Review the breakdown</h3><p>See the estimated total and exactly which inputs shape it.</p></article>
            <article className="step"><span className="step-number">STEP 03</span><h3>Verify before you commit</h3><p>Confirm carrier quotes, customs treatment and local charges with their official sources.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="callout">
            <div><h2>Start with the numbers you have.</h2><p>Build a first estimate in a few minutes, then improve it as better information arrives.</p></div>
            <Link href="/calculator" className="button button-dark">Open the calculator <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
