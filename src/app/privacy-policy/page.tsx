import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Read how the current Portavero prototype handles calculator inputs, hosting data, external fonts, and privacy limitations."
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero"><div className="container"><span className="eyebrow">Legal</span><h1>Privacy policy</h1><p>Initial project policy. Update this page before collecting personal information or launching analytics, accounts or third-party integrations.</p></div></section>
      <section className="section"><div className="container content-narrow prose">
        <p><strong>Last updated: October 19, 2026</strong></p>
        <h2>Current website</h2><p>Portavero&apos;s current calculator runs in your browser and uses the values you enter to calculate an estimate. This version does not require an account to use the calculator and is not designed to submit calculator inputs to a Portavero application server.</p>
        <h2>Hosting and technical data</h2><p>The hosting provider may process technical information such as IP address, request details and security logs to deliver and protect the website. The exact data and retention periods depend on the hosting configuration and must be confirmed before production launch.</p>
        <h2>External fonts, cookies and analytics</h2><p>The site currently requests the DM Sans and Manrope fonts from Google Fonts. That request may expose technical connection data, such as your IP address, to the font provider. This initial version does not intentionally add advertising or analytics trackers. Hosting, framework or future integrations may change how technical data is processed, so this policy must be reviewed against the actual deployment and the provider’s current terms before public launch.</p>
        <h2>Your choices</h2><p>Do not enter sensitive personal information into the calculator. If accounts, saved shipments, contact forms or analytics are introduced, this policy should be expanded to explain the data collected, purpose, legal basis where applicable, retention, processors and how to contact the operator.</p>
        <h2>Contact</h2><p>A verified project contact address has not yet been configured. Add a monitored contact method before public launch.</p>
        <div className="notice">This is a starter policy for an early project, not legal advice. Review it against the actual deployment and applicable privacy laws before launch.</div>
      </div></section>
    </>
  );
}
