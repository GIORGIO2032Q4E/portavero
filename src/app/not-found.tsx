import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container content-narrow">
        <span className="eyebrow">404 · Page not found</span>
        <h1 style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", marginTop: 18 }}>We couldn't find that page.</h1>
        <p>Check the address, or use one of the links below.</p>
        <div className="hero-actions"><Link href="/" className="button button-dark">Go to home</Link><Link href="/vehicle-import" className="button button-outline">Vehicle import planner</Link></div>
      </div>
    </section>
  );
}
