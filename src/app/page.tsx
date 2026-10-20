import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Import cost calculator",
    description: "Bring purchase price, shipping and other known costs together in one estimate.",
    href: "/calculator",
    link: "Open calculator",
    icon: "↗"
  },
  {
    number: "02",
    title: "Vehicle import estimate",
    description: "Check a preliminary estimate using a vehicle's age, engine and steering details.",
    href: "/vehicle-import",
    link: "Estimate vehicle costs",
    icon: "⌁"
  },
  {
    number: "03",
    title: "Vehicle catalogue",
    description: "Browse makes, models and common engine variants before you start calculating.",
    href: "/vehicles",
    link: "Browse vehicles",
    icon: "▤"
  },
  {
    number: "04",
    title: "Shipping checklist",
    description: "Know what to ask a shipping company before accepting a quote.",
    href: "/shipping",
    link: "View checklist",
    icon: "✓"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Import planning, made clearer</span>
            <h1>Know what goes into the <em>final cost.</em></h1>
            <p>Plan an import to Georgia with the numbers you have, see what is still missing, and keep the next steps in one place.</p>
            <div className="hero-actions">
              <Link href="/calculator" className="button button-dark">Start an estimate <span aria-hidden="true">↗</span></Link>
              <Link href="/vehicle-import" className="button button-outline">Importing a car?</Link>
            </div>
            <div className="trust-note"><span className="trust-dot" /> A practical independent project, still being improved.</div>
          </div>

          <div className="hero-art" aria-label="Illustration of an import planning route">
            <div className="home-orbit orbit-one" />
            <div className="home-orbit orbit-two" />
            <div className="float-note note-top">Your estimate <span>Costs in one view</span></div>
            <div className="route-card">
              <div className="route-card-top">
                <div>
                  <div className="route-label">IMPORT OVERVIEW</div>
                  <div className="route-title">Plan the journey</div>
                </div>
                <span className="status-label">PLANNING</span>
              </div>
              <div className="route-map">
                <span className="map-grid-mark mark-a" />
                <span className="map-grid-mark mark-b" />
                <span className="route-path" />
                <span className="map-point" />
                <span className="map-point end" />
                <div className="route-stop stop-start"><strong>IT</strong><span>Origin</span></div>
                <div className="route-stop stop-end"><strong>GE</strong><span>Destination</span></div>
                <div className="map-caption"><span>ORIGIN</span><span>DESTINATION</span></div>
              </div>
              <div className="route-stats">
                <div className="route-stat"><span>Costs you know</span><strong>Added by you</strong></div>
                <div className="route-stat"><span>Missing details</span><strong>Flagged to check</strong></div>
              </div>
              <p className="route-disclaimer">Illustrative view, not live route tracking or a shipping quote.</p>
            </div>
            <div className="float-note note-bottom"><span className="mini-check">✓</span> Keep unknown costs visible <span>Update as quotes arrive</span></div>
          </div>
        </div>
      </section>

      <section className="section home-tools">
        <div className="container">
          <div className="section-heading home-section-heading">
            <span className="eyebrow">The toolkit</span>
            <h2>Start with what you're importing.</h2>
            <p>Pick a tool, add the details you already know, and work through the rest at your own pace.</p>
          </div>
          <div className="card-grid home-tool-grid">
            {tools.map((tool) => (
              <article className="feature-card home-feature-card" key={tool.number}>
                <div className="home-card-top"><span className="feature-icon">{tool.icon}</span><span className="home-card-number">{tool.number}</span></div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <Link className="text-link" href={tool.href}>{tool.link} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint home-steps">
        <div className="container home-steps-layout">
          <div className="section-heading">
            <span className="eyebrow">A sensible starting point</span>
            <h2>Three steps. No guesswork disguised as a quote.</h2>
            <p>Portavero helps organise your information. Final costs depend on the real quote and applicable rules.</p>
          </div>
          <div className="home-step-list">
            <article className="home-step"><span>01</span><div><h3>Add confirmed amounts</h3><p>Use the prices and fees you have from the seller or provider.</p></div></article>
            <article className="home-step"><span>02</span><div><h3>Mark what's still unknown</h3><p>Missing information stays visible instead of silently becoming zero.</p></div></article>
            <article className="home-step"><span>03</span><div><h3>Verify before you commit</h3><p>Confirm customs requirements and final charges with official sources and your provider.</p></div></article>
          </div>
        </div>
      </section>

      <section className="home-final">
        <div className="container home-final-inner">
          <div><span className="eyebrow">Ready when you are</span><h2>Start with the numbers you have.</h2><p>You can refine the estimate as better information comes in.</p></div>
          <Link href="/calculator" className="button button-green">Open the calculator <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
