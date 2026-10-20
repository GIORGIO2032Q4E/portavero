import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Read how the current Portavero prototype handles calculator inputs, hosting data, external fonts, and privacy limitations."
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero"><div className="container"><span className="eyebrow">Legal</span><h1>Privacy policy</h1><p>Starter policy for the current project. Review it against the deployed account and database configuration before public launch.</p></div></section>
      <section className="section"><div className="container content-narrow prose">
        <p><strong>Last updated: October 19, 2026</strong></p>
        <h2>Current website</h2><p>Portavero calculators run in your browser. If you create an account, Supabase Authentication processes your email address and password for account access. Portavero does not store your password itself. When signed in, estimates you save from the import calculator may be stored in the project database and linked to your account so they can be accessed on another device. Estimates saved while signed out remain in local browser storage.</p>
        <h2>Hosting and technical data</h2><p>The hosting provider may process technical information such as IP address, request details and security logs to deliver and protect the website. The exact data and retention periods depend on the hosting configuration and must be confirmed before production launch.</p>
        <h2>External fonts, cookies and analytics</h2><p>The site currently requests the DM Sans and Manrope fonts from Google Fonts. That request may expose technical connection data, such as your IP address, to the font provider. This initial version does not intentionally add advertising or analytics trackers. Hosting, framework or future integrations may change how technical data is processed, so this policy must be reviewed against the actual deployment and the provider’s current terms before public launch.</p>
        <h2>Your choices</h2><p>Do not enter sensitive personal information into the calculator. Account and saved-estimate data is processed by Supabase according to the project configuration and Supabase terms. Configure account deletion, retention and a monitored project contact method before public launch. Do not save sensitive personal information in estimate names or notes.</p>
        <h2>Contact</h2><p>A verified project contact address has not yet been configured. Add a monitored contact method before public launch.</p>
        <div className="notice">This is a starter policy for an early project, not legal advice. Review it against the actual deployment and applicable privacy laws before launch.</div>
      </div></section>
    </>
  );
}
