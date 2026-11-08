import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "The thinking behind Portavero, the tools in the project, and what they do not check."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>Why I built Portavero.</h1>
          <p>I started Portavero with a question: what does a car bought overseas actually cost by the time it reaches Georgia? The purchase price is only the start, and I wanted a way to keep the other costs in one place.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>It started with car imports</h2>
          <p>The first idea was to estimate the cost of bringing an auction car to Georgia. The bid is only one line: buyer fees, transport to an export port, sea freight, customs and delivery come after it. I wanted to enter those numbers in one place and see which ones were still assumptions. The project grew to include a general import calculator and a few vehicle-specific tools, but that is still the problem behind it.</p>

          <h2>What is in the project</h2>
          <ul>
            <li><strong>Import cost calculator.</strong> Add the costs you know and see their total. A blank field is excluded; the calculator does not invent a price for a charge you have not entered.</li>
            <li><strong>Vehicle import planner.</strong> Enter a passenger car's details to get a preliminary estimate of selected Georgian vehicle taxes and listed fees. The rules cover a limited set of cases, so the result needs to be checked against the Revenue Service.</li>
            <li><strong>VIN decoder.</strong> Request available technical details from the U.S. NHTSA vPIC service. It does not search accident, title, ownership, odometer, service or auction records.</li>
            <li><strong>Vehicle comparison.</strong> Keep up to four candidates in this browser and compare their specifications, entered costs and notes. The notes are not independently checked, and the list does not sync to another device.</li>
            <li><strong>Shipping tools.</strong> Work through a booking checklist and enter freight offers you have received. Portavero does not fetch live carrier prices or track a shipment.</li>
          </ul>

          <h2>How I built it</h2>
          <p>The site uses Next.js, React and TypeScript. I kept the vehicle-tax calculations in a separate module so they can be tested apart from the page. The VIN lookup calls NHTSA vPIC, while comparison candidates are stored in the browser. Supabase can provide account and saved-estimate storage when the project and its database schema are configured.</p>

          <h2>What still needs checking</h2>
          <p>Portavero is a planning tool, not a source of official prices or a customs decision. Shipping quotes, exchange rates and customs charges are not fetched automatically. The vehicle catalogue is a starting list, not a complete database, and a catalogue engine choice is not confirmation of the exact car. The VIN tool returns technical data only; no history result here means the history is unknown, not clean.</p>
          <p>Before buying or shipping, compare the vehicle documents with the details entered, ask providers what their quotes include, and confirm the applicable taxes and fees with the Georgian Revenue Service or a qualified broker.</p>
        </div>
      </section>
    </>
  );
}
