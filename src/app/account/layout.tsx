import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or create a Portavero account to access saved import estimates.",
  robots: { index: false, follow: false }
};

export default function AccountLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
