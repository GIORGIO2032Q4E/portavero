import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How import estimates work",
  description: "Where Portavero's entered costs and vehicle-tax estimates come from, and what is left out."
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">How Portavero works</span>
          <h1>Where the numbers come from.</h1>
          <p>There are two kinds of estimate here: one adds the costs you enter, and the other applies the project's selected vehicle-tax rules to the car details you provide. Neither one fetches a live shipping quote or an official customs assessment.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>1. Add the costs you already have</h2>
          <p>In the general import calculator, enter the purchase price, freight, insurance and other charges in the same currency. The total is the sum of those entries. A blank field stays out of the total, so it is worth checking the missing categories before treating the result as a full import cost.</p>

          <h2>2. Use the vehicle planner for a car</h2>
          <p>The vehicle planner takes the manufacture year, declaration year, engine capacity and selected vehicle configuration, then calculates preliminary excise and import duty using rules included in this project. It also adds GEL 480 in listed standard fees. These are built-in estimates, not amounts retrieved from the Revenue Service, and the rules may not cover every vehicle or situation.</p>
          <p>You can add known purchase, auction, transport, shipping, insurance, port and delivery costs as well. Those entries are kept separate from costs you have not supplied. Check the exact engine and vehicle details against the documents; a catalogue selection is not a VIN-level confirmation.</p>

          <h2>3. Read the result as a working total</h2>
          <p>The amount shown is based on the information in the form. It does not include a charge simply because that charge might apply. A missing freight quote, destination fee or document cost can change the final amount, so add it when you have a confirmed figure.</p>

          <h2>4. Verify before making a decision</h2>
          <p>Check what each transport quote includes and whether it has separate origin or destination charges. For a vehicle, confirm the specifications, registration eligibility, tax treatment and current fees with the Georgian Revenue Service or a qualified customs broker. Use the calculator to organise your figures, not as a substitute for those checks.</p>

          <div className="notice"><strong>One important limit:</strong> Portavero does not automatically retrieve shipping prices, exchange rates or current customs charges. The vehicle-tax rules and GEL 480 fee amount are part of this project's code and should be checked against current official information before use.</div>

          <h2>What the labels mean</h2>
          <ul>
            <li><strong>User-entered:</strong> an amount or detail you supplied.</li>
            <li><strong>Calculated:</strong> arithmetic performed using the supplied values.</li>
            <li><strong>Estimated:</strong> a planning result from the project's built-in vehicle rules.</li>
            <li><strong>Not yet verified:</strong> a detail or amount that still needs confirmation from a document, provider or official source.</li>
          </ul>
          <p><Link href="/calculator" className="text-link">Open the import cost calculator <span aria-hidden="true">↗</span></Link></p>
        </div>
      </section>
    </>
  );
}
