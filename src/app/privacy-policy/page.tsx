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
          <p><strong>Last updated: November 15, 2026</strong></p>

          <h2>Vehicle details and cost estimates</h2>
          <p>The current vehicle-import planner performs its calculations in your browser. The costs and vehicle details you enter into that planner are not sent to an external service just to calculate the displayed estimate. Do not enter sensitive personal or financial information.</p>

          <h2>When you check a VIN</h2>
          <p>When you submit a VIN, the browser sends it to the Portavero VIN lookup route. That server route validates the VIN format and sends the VIN to the U.S. National Highway Traffic Safety Administration (NHTSA) vehicle information service to request available technical specifications. If the NHTSA result has important gaps or is unavailable and the optional CARSXE_API_KEY server setting is configured, the route may also send the same VIN to the CarsXE International VIN Decoder. The optional provider key is kept on the server and is not sent to the browser.</p>
          <p>The lookup does not search accident, title, ownership, odometer, service or auction records. Both providers can return incomplete data, and their coverage varies by manufacturer, market and model year. Some Japanese domestic-market vehicles use frame or chassis numbers instead of standard 17-character VINs; those are not processed by this lookup. A missing result is not evidence that a vehicle has a clean history.</p>
          <p>Read the <a href="https://vpic.nhtsa.dot.gov/" target="_blank" rel="noreferrer">NHTSA vehicle information service details</a> and the <a href="https://docs.carsxe.com/docs/products/international-vin-decoder" target="_blank" rel="noreferrer">CarsXE international decoder documentation</a> for more about these providers.</p>

          <h2>Shipping information</h2>
          <p>Shipping prices and quote details are entered by you. The shipping guide and manual comparison do not contact shipping companies, retrieve live offers or send your quote details to a carrier. Quote entries remain in the page while it is open and are not saved when you leave.</p>

          <h2>What may remain in your browser</h2>
          <p>Earlier versions of Portavero included a vehicle comparison list. Data saved by those versions may still remain in the same browser's local storage even though the comparison feature is no longer offered. Anyone with access to that browser profile may be able to see locally stored information. Clearing the site's browser data can remove it.</p>
          <p>The current vehicle-import planner does not save estimates to an account. The account page is retained for access to older saved estimates.</p>

          <h2>Legacy account area</h2>
          <p>When the Supabase project is configured, account sign-up, sign-in and password recovery are handled by Supabase. Portavero does not store your password in its own database. Older estimates saved through that account feature are stored in the Supabase project's <code>saved_estimates</code> table. The database policies are intended to restrict each signed-in user to their own records.</p>
          <p>The current account implementation keeps the Supabase session in browser storage rather than an HttpOnly cookie. Avoid signing in on shared or untrusted devices, and do not put sensitive information in estimate names or notes. The account feature relates to older general-import estimates; it is not connected to the current vehicle-import planner.</p>
          <p>You can sign out and delete records shown in the account area. Browser data and account data are separate, so clearing one does not automatically delete the other.</p>

          <h2>Website hosting</h2>
          <p>Portavero is hosted by Vercel. Like most hosting services, Vercel may process technical details such as IP addresses, request information, timestamps and security logs to operate the site and protect it. What is collected and how long it is retained depends on Vercel's settings and current terms. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel's privacy policy</a>.</p>

          <h2>Analytics and other services</h2>
          <p>The current version does not intentionally use advertising or analytics trackers. It uses fonts available on your device. The VIN checker shares the submitted VIN with NHTSA for technical-data decoding and may also share it with CarsXE when the optional international fallback is configured and used. Other external links take you to government or provider websites that have their own privacy policies.</p>

          <h2>Your options</h2>
          <p>You can clear Portavero's browser data to remove information stored by earlier versions. You can also sign out and delete older estimates saved to your account. Deleting browser data does not delete account records, and deleting an account record does not clear browser storage.</p>

          <h2>About this policy</h2>
          <p>Portavero is a student project and does not currently publish a dedicated support email. This page describes the data flows in the current implementation. It must be reviewed again if the application adds new services or changes its hosting, database or storage behaviour.</p>
          <div className="notice">Portavero is not designed for sensitive personal information. This page is a project disclosure, not a claim of legal compliance for a commercial service. Review the deployed configuration, provider terms and applicable privacy requirements before commercial use.</div>
        </div>
      </section>
    </>
  );
}
