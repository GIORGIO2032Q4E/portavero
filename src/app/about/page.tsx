import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Portavero",
  description: "The purpose, implementation choices and current scope of the Portavero import-planning project."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About</span>
          <h1>A small project for planning import costs.</h1>
          <p>Portavero is an independent web project I am developing to make it easier to list the costs involved in bringing goods and vehicles into Georgia.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <h2>Why I made it</h2>
          <p>Importing something can involve more than the price paid to a seller. Shipping, insurance, port charges, taxes and local delivery can all add to the final cost. I wanted a simple place to write those amounts down and see what is still missing.</p>

          <h2>What it does today</h2>
          <ul>
            <li>Add up costs entered in the import calculator and keep missing amounts visible.</li>
            <li>Save supported estimates in the browser or to an account when cloud saving is configured.</li>
            <li>Give a preliminary vehicle-tax estimate for selected cases, with a printable summary.</li>
            <li>Compare manually entered shipping quotes and review questions to ask a provider.</li>
          </ul>

          <h2>How it is built</h2>
          <p>The site uses Next.js, React, TypeScript and CSS. Vehicle-tax rules are kept in a small module separate from the page interface, with automated tests for common cases. Supabase supports account features and saved estimates; its database schema uses row-level security to restrict estimate records to their owner.</p>
          <p>A key design choice is to keep user-entered amounts separate from unknown or unverified costs. A clean-looking total should not imply that a missing fee is free or that a preliminary tax figure is official.</p>

          <h2>What it does not do</h2>
          <p>Portavero does not book shipments, contact carriers, track cargo, fetch live shipping prices or replace the official customs calculator. The vehicle catalogue is a curated starter list, not a complete database. Confirm important amounts with the relevant provider or authority before making a payment.</p>
          <p>The project is still evolving, and its tools and information may change as I test and improve it.</p>
        </div>
      </section>
    </>
  );
}
