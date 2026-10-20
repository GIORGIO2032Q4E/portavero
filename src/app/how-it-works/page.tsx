import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How import estimates work",
  description: "See how Portavero combines user-entered costs, calculated totals, and clearly identified unknowns."
};

import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">How Portavero works</span>
          <h1>How the estimate works.</h1>
          <p>The calculator adds the amounts you enter. It does not include unknown costs or fetch shipping prices and official tax amounts automatically.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>1. Enter known costs</h2>
          <p>Add purchase value, freight, insurance, taxes and local charges using a consistent currency. Use actual provider quotes when you have them.</p>
          <h2>2. Read the breakdown</h2>
          <p>The current calculator sums the values entered. It can show a helpful planning total, but it cannot know that a fee applies unless you include it or a verified future integration supplies it.</p>
          <h2>3. Confirm what is missing</h2>
          <p>Ask the carrier, port, broker or relevant government authority to confirm any unknown amount. Tax treatment can depend on details such as product classification, origin, vehicle characteristics and the purpose of import.</p>
          <div className="notice"><strong>Estimates are not official determinations.</strong> Portavero is a planning aid, not a customs declaration, legal opinion, tax ruling, insurance policy or binding transport offer.</div>
          <h2>What the labels mean</h2>
          <ul>
            <li><strong>User-entered:</strong> a value supplied by you.</li>
            <li><strong>Calculated:</strong> arithmetic performed on the entered values.</li>
            <li><strong>Estimated:</strong> a planning figure that may differ from the final charge.</li>
            <li><strong>Not yet verified:</strong> information that should be confirmed before relying on it.</li>
          </ul>
          <p><Link href="/calculator" className="text-link">Try the calculator <span aria-hidden="true">↗</span></Link></p>
        </div>
      </section>
    </>
  );
}
