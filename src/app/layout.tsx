import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portavero | Know the full cost before you import",
    template: "%s | Portavero"
  },
  description:
    "Plan cross-border imports with a clearer view of product, shipping, insurance and other costs. Start with a transparent import estimate for Georgia.",
  applicationName: "Portavero",
  icons: { icon: "/favicon.svg" },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <Link href="/" className="brand">
                <span className="brand-mark" aria-hidden="true">P</span>
                <span>porta<span className="brand-light">vero</span></span>
              </Link>
              <p>A small tool for planning import costs.</p>
            </div>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Portavero. Independent project.</span>
            <span>Estimates are planning tools, not customs declarations or binding quotes.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
