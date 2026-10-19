import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portavero.com"),
  title: {
    default: "Portavero | Know the full cost before you import",
    template: "%s | Portavero"
  },
  description:
    "Plan cross-border imports with a clearer view of product, shipping, insurance and other costs. Start with a transparent import estimate for Georgia.",
  applicationName: "Portavero",
  keywords: ["import cost calculator", "shipping estimator", "Georgia imports", "vehicle import"],
  openGraph: {
    title: "Portavero | Know the full cost before you import",
    description: "A clearer starting point for cross-border import planning.",
    type: "website",
    siteName: "Portavero"
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f3"
};

const navigation = [
  { href: "/calculator", label: "Import calculator" },
  { href: "/vehicle-import", label: "Vehicle import" },
  { href: "/shipping", label: "Shipping" },
  { href: "/how-it-works", label: "How it works" }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="brand" aria-label="Portavero home">
              <span className="brand-mark" aria-hidden="true">P</span>
              <span>porta<span className="brand-light">vero</span></span>
            </Link>
            <nav className="main-nav" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link href={item.href} key={item.href}>{item.label}</Link>
              ))}
            </nav>
            <Link href="/calculator" className="button button-small button-dark header-cta">
              Calculate cost <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <Link href="/" className="brand">
                <span className="brand-mark" aria-hidden="true">P</span>
                <span>porta<span className="brand-light">vero</span></span>
              </Link>
              <p>Know the full cost before you import.</p>
            </div>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Portavero. Built for clearer decisions.</span>
            <span>Estimates are planning tools, not customs declarations or binding quotes.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
