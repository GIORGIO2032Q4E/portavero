import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "A plain-language guide to what Portavero saves, what leaves your browser and which outside services are involved."
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Project information</span>
          <h1>Privacy policy</h1>
          <p>Here is what happens to the information you enter in Portavero, what stays in your browser and what is sent to another service.</p>
        </div>
      </section>
      <section className="section">
        <div className="container content-narrow prose">
          <p><strong>Last updated: November 8, 2026</strong></p>

          <h2>The details you enter</h2>
          <p>The car-import planner does its calculations in your browser. The amounts you enter are not sent to Portavero just to work out a total. Please do not enter sensitive personal or financial information.</p>

          <h2>What stays in your browser</h2>
          <p>The current version no longer offers a car comparison list. Saved comparison details from an earlier version may still remain in your browser storage. Anyone with access to the same browser profile may be able to see that information. Clearing the site's browser data can remove it.</p>
          <p>Shipping quotes are kept only while that page is open. They are not saved after you leave, and they are not sent to a shipping company.</p>

          <h2>When you check a VIN</h2>
          <p>When you enter a VIN, Portavero sends it to the U.S. National Highway Traffic Safety Administration (NHTSA) to look up available vehicle specifications. Your VIN is shared with NHTSA for this lookup. The lookup does not search accident, title, ownership, mileage, service or auction records.</p>
          <p>Read the <a href="https://vpic.nhtsa.dot.gov/" target="_blank" rel="noreferrer">NHTSA vehicle information service details</a> for more about the lookup.</p>

          <h2>When you use an account</h2>
          <p>You do not need an account to check a VIN or estimate a car import. Sign-up, sign-in and password resets are handled by Supabase when the project is configured. Portavero does not store your password in its own database. Estimates saved through the account feature are stored in the Supabase project's <code>saved_estimates</code> table. The database rules are set up so a signed-in user can access only their own saved estimates.</p>
          <p>There is an important limitation: the current version keeps the Supabase session in browser storage rather than an HttpOnly cookie. Avoid signing in on shared or untrusted devices, and do not put sensitive information in saved estimates.</p>
          <p>You can view and delete account estimates from the account page. Loading one creates a copy in your browser. Editing that copy does not change the original saved estimate in your account.</p>

          <h2>Website hosting</h2>
          <p>Portavero is hosted by Vercel. Like most hosting services, Vercel may process technical details such as IP addresses, request information, timestamps and security logs to keep the site running and protect it. What is collected and how long it is kept depends on Vercel's settings and current terms. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel's privacy policy</a>.</p>

          <h2>Analytics and outside services</h2>
          <p>The currency converter retrieves the published USD reference rate from the National Bank of Georgia. The amount you enter is converted in your browser and is not sent to the bank.</p>
          <p>The current version does not intentionally use advertising or analytics trackers. It uses the fonts already available on your device. The VIN checker is the feature that shares the VIN with NHTSA for a vehicle-details lookup. Other external links take you to government or provider websites, which have their own privacy policies.</p>

          <h2>Your options</h2>
          <p>You can clear Portavero's browser data to remove information left by earlier versions. You can also sign out and delete estimates saved to your account. Browser data and account data are separate, so deleting one does not automatically delete the other.</p>

          <h2>A note about this policy</h2>
          <p>Portavero is a student project and does not have a dedicated support email yet. This page describes how the current version works. That may change if new services are added or the hosting and database setup changes.</p>
          <div className="notice">Portavero is not designed for sensitive personal information and this page is not a claim of legal compliance for a commercial service. Review the deployed configuration, third-party provider terms and applicable privacy requirements before using the project commercially.</div>
        </div>
      </section>
    </>
  );
}
