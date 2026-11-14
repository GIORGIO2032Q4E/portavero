import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "Why I started the car-import project, how it is built and where its estimates stop."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>Why I built Portavero.</h1>
          <p>An auction price tells you only part of the story. There may also be buyer fees, transport to the port, sea freight, customs and local delivery, each listed in a different place. I wanted a way to put the costs I knew together and see what was still missing.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>Where it started</h2>
          <p>I started with a simple cost list for an auction car. The idea was to enter the amounts I had and leave the rest empty until I got a proper quote. An unknown cost is not a free cost, and I did not want an incomplete subtotal to look like the final price of the car.</p>

          <h2>How I built it</h2>
          <p>Portavero is built with Next.js, React and TypeScript. The tax and cost calculations live in separate JavaScript files, which makes them easier to test without opening the website. The VIN page sends a request to NHTSA vPIC through a Next.js API route. Car comparisons stay in the browser, while Supabase can store general import estimates when account settings are configured.</p>

          <h2>A few decisions I made</h2>
          <p>I chose not to guess an engine size when a model has several versions. The VIN page shows the technical details NHTSA can return; it does not check accident or auction history. Shipping prices, exchange rates and tax rates still have to come from the user. The site does not fetch them.</p>

          <h2>What is not finished</h2>
          <p>The catalogue is still incomplete. The tax estimate covers only selected passenger-car cases, and the GEL 480 fee amount is a saved snapshot rather than a live lookup. You still need to check the car's documents, current customs rules and the shipping quote before making a decision.</p>
          <p>The source code, tests and manual QA checklist are in the <a href="https://github.com/GIORGIO2032Q4E/portavero" target="_blank" rel="noreferrer">Portavero repository</a>.</p>
        </div>
      </section>
    </>
  );
}
