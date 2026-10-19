import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container content-narrow">
        <span className="eyebrow">404 · Off route</span>
        <h1 style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", marginTop: 18 }}>This page missed its connection.</h1>
        <p>The address may have changed, or the page may not exist yet.</p>
        <div className="hero-actions"><Link href="/" className="button button-dark">Back to Portavero</Link><Link href="/calculator" className="button button-outline">Open calculator</Link></div>
      </div>
    </section>
  );
}
