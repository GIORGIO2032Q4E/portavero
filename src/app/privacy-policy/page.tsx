import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How the Portavero project prototype handles calculator inputs, account data, hosting logs and external fonts."
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero"><div className="container"><span className="eyebrow">Project information</span><h1>Privacy policy</h1><p>This page explains what the current Portavero prototype stores and which third-party services it uses.</p></div></section>
      <section className="section"><div className="container content-narrow prose">
        <p><strong>Last updated: October 21, 2026</strong></p>
        <h2>Calculator inputs and saved estimates</h2><p>Calculator inputs are processed in your browser. Estimates saved while you are signed out are kept in your browser's local storage. If you create an account and choose to save an estimate from the cost calculator, the estimate may be stored in the Portavero Supabase database and linked to your account so you can access it later. The browser also stores an authentication session locally to keep you signed in between visits.</p>
        <h2>Account information</h2><p>Supabase Authentication handles account sign-up, sign-in and password reset. Portavero does not store your password itself. The database uses row-level security policies intended to restrict saved-estimate records to their owning account. Do not treat this prototype as a place to store sensitive personal or financial information.</p>
        <h2>Hosting and technical data</h2><p>The hosting provider may process technical information such as IP addresses, request details and security logs to deliver and protect the website. The exact data collected and its retention period depend on the provider's configuration and current terms.</p>
        <h2>External fonts, cookies and analytics</h2><p>The site requests the DM Sans and Manrope fonts from Google Fonts. That request may expose technical connection data, such as your IP address, to the font provider. The project does not intentionally include advertising or analytics trackers. Hosting, framework behavior or future integrations may change how technical data is processed.</p>
        <h2>Your choices</h2><p>You can sign out of your account. Estimates saved in the browser can be affected by clearing that browser's site data. Cloud estimates can be managed from the account page where those controls are available. Avoid putting sensitive personal information in estimate names or notes.</p>
        <h2>Contact</h2><p>This student-developed project prototype does not currently have a dedicated support email address.</p>
        <div className="notice">This page describes the current prototype and is not a claim of legal compliance for a commercial service. Review the actual deployment, provider terms and applicable privacy requirements before using Portavero commercially.</div>
      </div></section>
    </>
  );
}
