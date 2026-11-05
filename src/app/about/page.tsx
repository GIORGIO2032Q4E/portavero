import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "A vehicle-import project focused on VIN technical data and preliminary import-cost estimates for Georgia."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About Portavero</span>
          <h1>A project about vehicle information and import costs.</h1>
          <p>I built Portavero as a web project focused on two related tasks: checking the technical information available from a vehicle's VIN and estimating the cost of importing a car into Georgia.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>What the project is for</h2>
          <p>Vehicle research and import planning involve different kinds of information. A VIN decoder can return technical specifications, while an import estimate brings purchase, transport, tax and other expenses together. Portavero puts tools for both tasks in one application and makes it clear when information is entered by the user, returned by an external source or still needs to be checked.</p>

          <h2>What it includes</h2>
          <ul>
            <li><strong>VIN decoding:</strong> sends a 17-character VIN to the NHTSA vPIC service and displays the technical fields returned for that vehicle.</li>
            <li><strong>Vehicle import estimate:</strong> uses the vehicle details entered by the user to calculate selected tax amounts under the rules implemented in the project, then adds the known expenses entered for that car.</li>
            <li><strong>Vehicle catalogue and comparison:</strong> provides a limited list of makes, models and engine variants, and lets users save up to four vehicle candidates in the current browser.</li>
            <li><strong>Supporting calculators:</strong> includes a general import-cost calculator and a tool for comparing shipping quotes entered by the user.</li>
          </ul>

          <h2>How it is built</h2>
          <p>Portavero uses Next.js, React, TypeScript and CSS. Calculation and validation logic is kept in separate modules and covered by tests for important cases. NHTSA vPIC supplies the VIN technical data. Supabase provides optional accounts and saved estimates when the project is configured for it.</p>

          <h2>What it does not do</h2>
          <p>The VIN decoder does not search accident, title, ownership, odometer, service or auction records, and it does not retrieve auction photos. A missing result is not evidence of a clean history. Some vehicles, especially those built for markets outside the United States, may return limited VIN information.</p>
          <p>Portavero does not fetch live shipping prices, book or track transport, or provide an official tax assessment. The vehicle catalogue is limited, and the estimator only covers the cases represented by its current inputs and rules. It currently includes a GEL 480 fee amount configured in the calculator; confirm the applicable fees and tax treatment with the <a href="https://www.rs.ge/CarClearance-en" target="_blank" rel="noreferrer">Georgian Revenue Service</a> before relying on an estimate.</p>
          <p>The aim is to make the information and assumptions visible, not to present a preliminary calculation as a final import price.</p>
        </div>
      </section>
    </>
  );
}
