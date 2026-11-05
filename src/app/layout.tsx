import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portavero | Vehicle import planning",
    template: "%s | Portavero"
  },
  description:
    "A project for decoding available VIN technical data and estimating the cost of importing a car into Georgia.",
  applicationName: "Portavero",
  icons: { icon: "/favicon.svg" },
  keywords: ["VIN decoder", "vehicle import estimate", "Georgia vehicle import", "vehicle tax estimate"],
  openGraph: {
    title: "Portavero | VIN decoding and vehicle import estimates",
    description: "Check available technical details from a VIN and build a preliminary vehicle import-cost estimate for Georgia.",
    type: "website",
    siteName: "Portavero"
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f6f1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <footer className="site-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <Link href="/" className="brand">
                <span className="brand-mark" aria-hidden="true">P</span>
                <span>Portavero</span>
              </Link>
              <p>A vehicle-import project focused on VIN data and preliminary cost estimates for Georgia.</p>
            </div>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link href="/vin-check">VIN check</Link>
              <Link href="/vehicles">Vehicle catalogue</Link>
              <Link href="/compare">Compare cars</Link>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/account">Account</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Portavero. Independent project.</span>
            <span>Estimates are planning tools, not customs declarations or binding quotes.</span>
          </div>
        </div>
      </body>
    </html>
  );
}
