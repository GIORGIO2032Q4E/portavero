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
          <p>An auction price is not the full cost of bringing a car to Georgia. Buyer fees, transport to the export port, sea freight, customs and delivery can come from different quotes and documents. I wanted to see those amounts together.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>The first problem</h2>
          <p>The first version was a place to enter the costs around an auction car and see what was still missing. I kept unknown charges blank instead of treating them as free. That small rule matters: a subtotal made from incomplete information should not look like a final landed cost.</p>

          <h2>How I built it</h2>
          <p>The site uses Next.js, React and TypeScript. I keep the cost and vehicle-tax calculations in separate JavaScript modules, so the arithmetic and input rules can be tested with Node without opening a page. The VIN form sends a request through a Next.js route to NHTSA vPIC. The car comparison list stays in the current browser. Supabase is used only for general saved estimates when it is configured.</p>

          <h2>Choices behind the current version</h2>
          <p>The catalogue does not guess an engine size when a model has several variants. The VIN page shows technical data returned by NHTSA, not accident or auction history. Freight prices, exchange rates and tariff rates are entered or checked by the user; Portavero does not fetch them.</p>

          <h2>What still needs checking</h2>
          <p>The catalogue is incomplete, and the vehicle-tax estimator covers selected passenger-car cases rather than every classification or exception. Its fee amount is a stored snapshot. Real customs calculations, vehicle documents and carrier quotes still need to be checked before a purchase or shipment.</p>
          <p>The source code, tests and manual QA checklist are in the <a href="https://github.com/GIORGIO2032Q4E/portavero" target="_blank" rel="noreferrer">Portavero repository</a>.</p>
        </div>
      </section>
    </>
  );
}
