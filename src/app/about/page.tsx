import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "Learn about Portavero, an independent import-planning project focused on transparent costs and honest estimates."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About Portavero</span>
          <h1>Import planning should feel less opaque.</h1>
          <p>Portavero is an independent project exploring a simpler way to plan cross-border imports by making costs, assumptions and unanswered questions easier to see.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>What we are building</h2>
          <p>The first version focuses on practical cost estimates, with an initial interest in imports arriving in Georgia. The aim is to help people think through the full journey before they commit money.</p>
          <h2>What we are not claiming</h2>
          <p>Portavero does not currently claim live shipment tracking, live carrier rates, official customs calculations, partnerships with shipping providers, or professional brokerage services. Features will be described as available only when they are actually implemented and verified.</p>
          <h2>Built in the open</h2>
          <p>The project is being developed as a practical software project. Feedback and careful verification are part of making it useful.</p>
        </div>
      </section>
    </>
  );
}
