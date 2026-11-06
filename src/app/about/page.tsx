import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "Why I built Portavero, what it helps with, and where its estimates have limits."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>A practical way to keep import costs together.</h1>
          <p>I built Portavero as a small project to help me organise the costs involved in bringing goods or a vehicle into Georgia.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>Why I made it</h2>
          <p>The price you pay for an item or car is only the beginning. Shipping, insurance, customs charges and delivery can change the final cost, and you might not have every number when you start planning. Portavero gives those figures one place to live and helps show what still needs checking.</p>

          <h2>What you can use it for</h2>
          <ul>
            <li>Add up the import costs you enter and see which amounts you haven't included.</li>
            <li>Save estimates in your browser and print them or save them as a PDF.</li>
            <li>Get a preliminary estimate of selected vehicle taxes from the details you provide.</li>
            <li>Browse a starter vehicle catalogue and work through a shipping checklist with quotes you've collected.</li>
          </ul>

          <h2>How it's built</h2>
          <p>Portavero uses Next.js, React, TypeScript and CSS. The vehicle-tax calculations are kept in a separate module with tests for common cases. Supabase can handle accounts and saved estimates when the project is configured for it.</p>

          <h2>What to double-check</h2>
          <p>Portavero doesn't fetch live shipping prices, track cargo or replace official customs guidance. The vehicle catalogue covers selected models, and tax estimates don't cover every situation. Use quotes from your provider and confirm vehicle-specific tax rules with the Georgian Revenue Service before relying on a figure.</p>
        </div>
      </section>
    </>
  );
}
