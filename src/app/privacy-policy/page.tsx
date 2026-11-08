import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What the Portavero prototype stores in your browser and which external services are used."
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Project information</span>
          <h1>Privacy policy</h1>
          <p>This page describes how the current Portavero prototype handles calculator entries, saved comparisons, VIN lookups and optional account data.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <p><strong>Last updated: November 8, 2026</strong></p>

          <h2>Information entered into calculators</h2>
          <p>The general import calculator and vehicle import planner perform their calculations in your browser. The figures you enter are not sent to Portavero's server merely to calculate a result. Avoid entering sensitive personal or financial information.</p>

          <h2>Browser storage</h2>
          <p>The general import calculator can save up to ten estimates in your browser's local storage. Vehicle comparison can save up to four candidates in the same browser. A comparison candidate may contain vehicle details, a VIN, cost figures and notes that you entered about the vehicle's condition or history. Anyone with access to the same browser profile may be able to access this locally stored information. Clearing the site's browser data can remove it.</p>
          <p>The shipping quote comparison is held in the current page state and is not saved after you leave the page. It is not sent to a shipping provider.</p>

          <h2>VIN lookup and NHTSA</h2>
          <p>When you submit a VIN on the VIN Check page, the browser sends it to the Portavero VIN API route. That route sends the VIN to the U.S. National Highway Traffic Safety Administration's vPIC decoder and returns available technical fields and provider warnings. The VIN is therefore shared with NHTSA for the lookup. Portavero does not use this request to search accident, title, ownership, odometer, service or auction records.</p>
          <p>See the <a href="https://vpic.nhtsa.dot.gov/api/" target="_blank" rel="noreferrer">NHTSA vPIC API information</a> for details about that service.</p>

          <h2>Account information and Supabase</h2>
          <p>Account features are optional and require a configured Supabase project. Supabase Authentication handles sign-up, sign-in and password reset. Portavero does not store your password in its own database. When you choose to save a general estimate to your account, the estimate is stored in the Supabase project's <code>saved_estimates</code> table. The SQL setup enables row-level security and defines policies that restrict records to the signed-in user who owns them.</p>
          <p>The current prototype stores the Supabase session in browser local storage. It does not use an HttpOnly session cookie. This is a known security limitation. Avoid signing in on shared or untrusted devices, and do not store sensitive information in estimates.</p>
          <p>Cloud estimates can be listed, loaded into the current browser and deleted from the account page. Loading creates a local browser copy. Editing a local copy does not automatically update the original cloud record.</p>

          <h2>Hosting and technical information</h2>
          <p>The site is hosted by Vercel. Hosting and security services may process technical information such as IP addresses, request details, timestamps and security logs to deliver and protect the website. The exact information and retention periods depend on the provider's configuration and current terms. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel's privacy policy</a>.</p>

          <h2>Analytics, advertising and external resources</h2>
          <p>The current project does not intentionally include advertising or analytics trackers. It uses system fonts and does not request fonts from an external font service. The VIN decoder is the feature that makes a deliberate external data request to NHTSA. Links to official government and provider websites open those services under their own policies.</p>

          <h2>Your choices</h2>
          <p>You can remove browser-saved estimates and comparison candidates through the site where those controls are provided, or clear the site's local storage in your browser. You can sign out of your Portavero account and delete cloud estimates from the account page. The account and browser copies are separate, so deleting one does not necessarily delete the other.</p>

          <h2>Contact and scope</h2>
          <p>This is a student-developed project prototype and does not currently have a dedicated support email address. This page describes the data handling implemented in the current version; future integrations or changes to the hosting and database configuration may change it.</p>
          <div className="notice">Portavero is not designed for sensitive personal information and this page is not a claim of legal compliance for a commercial service. Review the deployed configuration, third-party provider terms and applicable privacy requirements before using the project commercially.</div>
        </div>
      </section>
    </>
  );
}
