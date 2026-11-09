import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How import estimates work",
  description: "How Portavero calculates entered costs and selected vehicle taxes."
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">How Portavero works</span>
          <h1>How the estimates are put together.</h1>
          <p>The vehicle planner uses car details and tax rules stored in the project. The general calculator adds the amounts and rates you enter. The VIN page requests technical data from NHTSA vPIC.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>For a car</h2>
          <p>Choose the manufacture year, expected declaration year, engine capacity and vehicle configuration. The planner uses those values to estimate excise and import duty under the selected rules. It is intended for selected passenger vehicles under HS 8703; it does not decide the vehicle's legal classification or confirm eligibility for transitional treatment.</p>
          <p>You can then add the purchase price, auction fees, inland transport, shipping, insurance, port charges and local delivery. Amounts are entered in GEL. Blank fields are left out of the total and shown as unknown.</p>
          <p>The planner also adds GEL 480 in listed standard fees. That amount is stored in the code and is not retrieved live, so check the current fee schedule before using it.</p>

          <h2>For other goods</h2>
          <p>The general calculator adds the costs you enter in the selected currency. You can enter duty and VAT/GST rates after checking them with the destination customs authority. Portavero does not select a tariff code, look up a rate or convert currencies using a live exchange rate.</p>

          <h2>VIN and comparison</h2>
          <p>The VIN checker sends a correctly formatted 17-character VIN to NHTSA vPIC and displays the technical fields that service returns. Some cars, especially those built for markets outside the United States, may have limited results. The service does not provide the accident, title, ownership, mileage or auction history in this project.</p>
          <p>The comparison page stores up to four cars in the current browser. It shows the specifications, entered costs and notes you saved; it does not verify those notes or sync the list to another device.</p>

          <h2>Before using the result</h2>
          <p>A total can only include the amounts and rules available to the calculator. It may be incomplete when you have not entered freight, port, broker or document charges. Check vehicle details and the current tax treatment with the Georgian Revenue Service or a qualified customs broker before buying or shipping.</p>
          <p><Link href="/vehicle-import" className="text-link">Open the vehicle import planner <span aria-hidden="true">↗</span></Link></p>
        </div>
      </section>
    </>
  );
}
