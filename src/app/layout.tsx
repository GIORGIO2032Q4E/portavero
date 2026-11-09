import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portavero | Car import planner for Georgia",
    template: "%s | Portavero"
  },
  description:
    "A student-built car-import planning project for Georgia. Estimate selected vehicle taxes, organise known costs, compare cars and check available VIN technical data.",
  applicationName: "Portavero",
  icons: { icon: "/favicon.svg" },
  keywords: ["car import Georgia", "vehicle import costs", "Georgia vehicle taxes", "VIN technical data", "vehicle comparison"],
  openGraph: {
    title: "Portavero | Plan a car import to Georgia",
    description: "Estimate selected vehicle taxes, organise known import costs, compare cars and request available VIN technical data.",
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
              <p>A student-built project for planning car imports to Georgia.</p>
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
        </footer>
      </body>
    </html>
  );
}
