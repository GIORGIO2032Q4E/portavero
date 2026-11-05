import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Portavero works",
  description: "How Portavero decodes available VIN data and builds a preliminary vehicle import-cost estimate for Georgia."
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">How Portavero works</span>
          <h1>From vehicle details to an import-cost estimate.</h1>
          <p>Portavero has two main tools: a VIN decoder for available technical information and a vehicle estimator that works from the details and costs you enter.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>1. Decode the VIN</h2>
          <p>Enter a 17-character VIN. Portavero checks its format and sends it to the U.S. National Highway Traffic Safety Administration's vPIC decoder. Depending on the vehicle and the data available, the response can include details such as make, model, model year and engine specifications.</p>
          <p>This is a technical lookup, not a vehicle-history report. It does not search accident, title, ownership, mileage, service or auction records. Information for vehicles built for markets outside the United States may be limited or unavailable.</p>

          <h2>2. Confirm the vehicle details</h2>
          <p>The VIN lookup and the import estimator are separate tools. A VIN result does not automatically verify every specification or fill in the estimator. Check the returned details against the VIN on the vehicle and its documents, then choose a catalogue entry or enter the vehicle specifications yourself.</p>
          <p>The catalogue covers selected makes, models and engine variants. A listed variant is a guide, not confirmation of the exact engine fitted to a particular car.</p>

          <h2>3. Add the import costs</h2>
          <p>Enter the purchase price, auction fees, inland transport, shipping, insurance, port charges and local delivery when you have those figures. The vehicle estimator calculates selected excise and import-duty amounts using the rules implemented in the project and adds the fee amount currently configured in the calculator.</p>
          <p>Costs you have not entered remain unknown. A displayed total is based on the included figures and should not be read as a guaranteed final landed cost.</p>

          <h2>4. Review and verify the estimate</h2>
          <p>Check the vehicle details, tax estimate, entered expenses and any warnings. The calculator currently includes a GEL 480 fee amount. Tax treatment and fees can depend on the vehicle and the rules in force when it is declared, so confirm the current result with the <a href="https://www.rs.ge/CarClearance-en" target="_blank" rel="noreferrer">Georgian Revenue Service vehicle calculator</a> before buying or shipping a car. Confirm freight, port and delivery charges with the relevant providers.</p>

          <h2>5. Compare and keep track of candidates</h2>
          <p>You can save up to four vehicle candidates in your browser and compare their entered details, costs and warnings. Saved candidates stay in that browser. You can also print an estimate or use the browser's print dialog to save it as a PDF.</p>

          <div className="notice"><strong>Estimates are not official determinations.</strong> Portavero is a planning tool, not a customs declaration, legal opinion, tax ruling, insurance policy or binding transport offer.</div>

          <h2>What the labels mean</h2>
          <ul>
            <li><strong>User-entered:</strong> a value supplied by you.</li>
            <li><strong>Calculated:</strong> arithmetic performed on the values entered or on the rules implemented in the estimator.</li>
            <li><strong>Estimated:</strong> a planning figure that may differ from the final charge.</li>
            <li><strong>Not yet verified:</strong> information that should be checked before relying on it.</li>
          </ul>

          <p><Link href="/vin-check" className="text-link">Decode a VIN <span aria-hidden="true">↗</span></Link></p>
          <p><Link href="/vehicle-import" className="text-link">Open the vehicle import estimator <span aria-hidden="true">↗</span></Link></p>
          <p><Link href="/calculator" className="text-link">Use the general import calculator <span aria-hidden="true">↗</span></Link></p>
        </div>
      </section>
    </>
  );
}
