import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thanks for using Portavero to plan your import costs.",
  robots: { index: false, follow: true }
};

export default function ThankYouPage() {
  return (
    <section className="section">
      <div className="container content-narrow">
        <span className="eyebrow">Portavero</span>
        <h1 style={{ marginTop: 18 }}>Thanks for planning ahead.</h1>
        <p>This page does not confirm a booking, shipment, payment, or enquiry. Portavero's current tools help you prepare an estimate; they do not place orders or contact carriers.</p>
        <div className="hero-actions">
          <Link href="/calculator" className="button button-dark">Return to calculator</Link>
          <Link href="/how-it-works" className="button button-outline">How estimates work</Link>
        </div>
      </div>
    </section>
  );
}
