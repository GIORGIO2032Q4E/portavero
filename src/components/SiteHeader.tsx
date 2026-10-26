"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/calculator", label: "Import calculator" },
  { href: "/vehicle-import", label: "Vehicle import" },
  { href: "/vin-check", label: "VIN check" },
  { href: "/vehicles", label: "Vehicle catalogue" },
  { href: "/shipping", label: "Shipping" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/account", label: "Account" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header" onKeyDown={(event) => { if (event.key === "Escape") closeMenu(); }}>
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Portavero home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Portavero</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`menu-glyph${menuOpen ? " is-open" : ""}`} aria-hidden="true"><span /><span /></span>
        </button>

        <nav
          id="primary-navigation"
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                href={item.href}
                key={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={active ? "nav-link is-active" : "nav-link"}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/calculator" className="button button-small button-dark header-cta" onClick={closeMenu}>
          Calculate cost <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
