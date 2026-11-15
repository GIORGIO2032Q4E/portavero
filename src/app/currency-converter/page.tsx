import type { Metadata } from "next";
import CurrencyConverter from "./currency-converter";

export const metadata: Metadata = {
  title: "USD to GEL converter",
  description: "Convert US dollars to Georgian lari and back using the National Bank of Georgia's official reference rate."
};

export default function CurrencyConverterPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Currency converter</span>
          <h1>USD ⇄ GEL, both directions.</h1>
          <p>Convert between US dollars and Georgian lari using the latest published official reference rate.</p>
        </div>
      </section>
      <CurrencyConverter />
    </>
  );
}
