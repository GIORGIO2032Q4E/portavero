import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "About this small import cost planning project and what it can currently do."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>A small project for planning import costs.</h1>
          <p>Portavero is a personal web project I am developing to make it easier to list the costs involved in bringing goods into Georgia.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>Why I made it</h2>
          <p>Importing something can involve more than the price paid to a seller. Shipping, insurance, port charges, taxes and local delivery can all add to the final cost. I wanted a simple place to write those amounts down and see what is still missing.</p>
          <h2>What works right now</h2>
          <ul>
            <li>Add up costs that you enter in the import calculator.</li>
            <li>Show which cost fields have not been filled in.</li>
            <li>Give a preliminary vehicle excise estimate using a limited set of rules.</li>
            <li>Provide a checklist of questions to ask a shipping provider.</li>
          </ul>
          <h2>What it does not do</h2>
          <p>Portavero does not book shipments, contact carriers, track cargo, fetch live shipping prices, convert currencies automatically, or replace the official customs calculator. Check important amounts with the relevant provider or authority before making a payment.</p>
          <p>This is an early version, so the tools and information may change as I test and improve the project.</p>
        </div>
      </section>
    </>
  );
}
