import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Check the car's VIN",
    description: "Enter the 17-character VIN. Portavero asks NHTSA for the make, model, year and engine details it can find.",
    href: "/vin-check",
    link: "Check a VIN"
  },
  {
    number: "02",
    title: "Estimate the import cost",
    description: "Use the details returned for that car, then add its purchase price, auction fees, shipping and other costs you know.",
    href: "/vehicle-import",
    link: "Estimate car costs"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="simple-hero">
        <div className="container simple-hero-grid">
          <div className="simple-hero-copy">
            <p className="simple-status">A car-import project built in Georgia</p>
            <h1>Check a car's VIN. Then work out what it may cost to import.</h1>
            <p className="simple-lede">Start with the VIN to bring in the car's available technical details. Use those details in an import estimate, add the costs from the auction and shipping quotes, and see what the total may look like in Georgia.</p>
            <div className="hero-actions">
              <Link href="/vin-check" className="button button-dark">Start with a VIN</Link>
            </div>
            <p className="simple-note">VIN data can be incomplete. Tax and fee estimates cover selected cases and must be checked with the Revenue Service.</p>
          </div>
          <aside className="simple-example">
            <div className="simple-example-heading">
              <span>CAR IMPORT COSTS</span>
              <span>GEL</span>
            </div>
            <div className="simple-example-row"><span>Car price</span><strong>Enter amount</strong></div>
            <div className="simple-example-row"><span>Auction fees</span><strong>Add if known</strong></div>
            <div className="simple-example-row"><span>Shipping</span><strong>Add your quote</strong></div>
            <div className="simple-example-row"><span>Customs charges</span><strong>Check with Revenue Service</strong></div>
            <p className="simple-example-foot">These are the costs used in an estimate, not a quote.</p>
          </aside>
        </div>
      </section>

      <section className="simple-tools-section">
        <div className="container">
          <div className="simple-section-heading">
            <p className="editorial-label">HOW TO USE PORTAVERO</p>
            <h2>One car, two steps.</h2>
            <p>The VIN gives the estimate a starting point. You can correct the details and fill in anything the decoder does not return.</p>
          </div>
          <div className="simple-tool-list">
            {steps.map((step) => (
              <article className="simple-tool-row" key={step.number}>
                <span className="simple-tool-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <Link href={step.href}>{step.link} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="simple-how-section">
        <div className="container simple-how-grid">
          <div>
            <p className="editorial-label">BEFORE YOU RELY ON THE NUMBER</p>
            <h2>Check these details first.</h2>
          </div>
          <ol>
            <li><strong>Match the car.</strong><span>Compare the VIN result with the car and its documents. NHTSA may not return every field.</span></li>
            <li><strong>Confirm the tax details.</strong><span>Check the engine size and steering side. The VIN decoder does not reliably confirm every detail used in the tax estimate.</span></li>
            <li><strong>Add real costs.</strong><span>Use the purchase price and actual auction, shipping, port and delivery quotes. Leave unknown costs blank.</span></li>
          </ol>
        </div>
      </section>
    </>
  );
}
