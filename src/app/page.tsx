import Link from "next/link";

const tools = [
  {
    number: "01",
    title: "Vehicle import estimate",
    description: "Add the car's year and engine size, then enter the purchase, auction and transport costs you know. The tax estimate covers selected cases only.",
    href: "/vehicle-import",
    link: "Estimate car costs"
  },
  {
    number: "02",
    title: "VIN check",
    description: "Enter a VIN to see the technical details NHTSA vPIC has for that car. It does not check accident or auction history.",
    href: "/vin-check",
    link: "Check a VIN"
  },
  {
    number: "03",
    title: "Compare vehicles",
    description: "Save up to four cars in this browser and compare their details, costs and the notes you've added.",
    href: "/compare",
    link: "Compare cars"
  },
  {
    number: "04",
    title: "Vehicle catalogue",
    description: "Look through common makes, models and engine options. Check the exact engine in the car's documents.",
    href: "/vehicles",
    link: "Browse the catalogue"
  },
  {
    number: "05",
    title: "Shipping checklist",
    description: "Put the shipping quotes you've received side by side and check what's included. No live prices are shown here.",
    href: "/shipping",
    link: "Review shipping offers"
  },
  {
    number: "06",
    title: "General import calculator",
    description: "For other goods, add the costs and tax rates you've checked. The calculator won't look up rates for you.",
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
            <p className="simple-status">A car-import project built in Georgia</p>
            <h1>Thinking about importing a car to Georgia? Start with the costs.</h1>
            <p className="simple-lede">The auction price is only the start. You may also need to pay buyer fees, transport to the port, shipping, customs and delivery. I built Portavero to put the costs you know in one place. Add each amount when you have it. Anything left blank stays out of the total.</p>
            <div className="hero-actions">
              <Link href="/vehicle-import" className="button button-dark">Estimate a car import</Link>
              <Link href="/calculator" className="simple-text-link">Importing other goods? <span aria-hidden="true">→</span></Link>
            </div>
            <p className="simple-note">No live freight prices, exchange rates or automatic tax-rate lookup.</p>
          </div>
          <aside className="simple-example">
            <div className="simple-example-heading">
              <span>CAR IMPORT COSTS</span>
              <span>GEL</span>
            </div>
            <div className="simple-example-row"><span>Car price</span><strong>Enter amount</strong></div>
            <div className="simple-example-row"><span>Auction fees</span><strong>Add if known</strong></div>
            <div className="simple-example-row"><span>Shipping</span><strong>Quote needed</strong></div>
            <div className="simple-example-row"><span>Customs charges</span><strong>Check with Revenue Service</strong></div>
            <p className="simple-example-foot">Just an example of the costs to enter, not a quote.</p>
          </aside>
        </div>
      </section>

      <section className="simple-tools-section">
        <div className="container">
          <div className="simple-section-heading">
            <p className="editorial-label">WHAT YOU CAN DO HERE</p>
            <h2>The car-import planner is the main tool.</h2>
            <p>Start with the car planner. The other pages help you check available VIN details, look up common engine options, compare cars or work out the cost of importing other goods.</p>
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
            <p className="editorial-label">BEFORE YOU RELY ON THE NUMBER</p>
            <h2>A few things worth checking first.</h2>
          </div>
          <ol>
            <li><strong>Check the car.</strong><span>Check the engine size and year against the car's documents.</span></li>
            <li><strong>Add the costs you have.</strong><span>Add shipping, port and broker charges when you have real figures. Until then, leave them blank.</span></li>
            <li><strong>Verify the tax result.</strong><span>The planner covers selected cases, not every vehicle or exception. Check the exact car with the Revenue Service before you buy or ship it.</span></li>
          </ol>
        </div>
      </section>

    </>
  );
}
