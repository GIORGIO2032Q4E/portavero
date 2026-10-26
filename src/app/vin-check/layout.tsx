import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIN Check",
  description: "Decode available vehicle specifications from the official NHTSA vPIC source. Accident, auction and ownership history is not included."
};

export default function VinCheckLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
