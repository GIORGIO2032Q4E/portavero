import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "Why I built Portavero and what its import-planning tools can and can't do."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>A small project for planning import costs.</h1>
          <p>I built Portavero to make it easier to keep track of the costs involved in bringing goods or a car into Georgia.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>Why I made it</h2>
          <p>The price paid to the seller is only one part of an import. Shipping, insurance, customs charges and local delivery can all add up, and you may not know every amount at the beginning. I wanted a way to put the costs I know in one place, see what's missing and get a starting estimate.</p>

          <h2>What it can do</h2>
          <ul>
            <li>Add up costs entered in the import calculator and show what is still missing.</li>
            <li>Keep estimates in the browser and print them or save them as a PDF.</li>
            <li>Give a preliminary estimate of selected vehicle taxes using the details you enter.</li>
            <li>Browse common vehicles and compare shipping quotes you enter yourself.</li>
          </ul>

          <h2>How it's built</h2>
          <p>The site uses Next.js, React, TypeScript and CSS. The vehicle-tax calculations live in a separate file and have tests for common cases. Supabase handles accounts and saved estimates when configured.</p>

          <h2>What it doesn't do</h2>
          <p>Portavero doesn't fetch live shipping prices, track cargo or replace the official customs calculator. The vehicle list is limited, and the tax estimate doesn't cover every case. Check charges with the relevant provider and confirm vehicle-specific tax rules with the Georgian Revenue Service before making a decision.</p>
        </div>
      </section>
    </>
  );
}
