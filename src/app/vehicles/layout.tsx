import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle catalogue",
  description: "Search Portavero's starter catalogue of common vehicle makes, models and engine variants before planning import costs for Georgia."
};

export default function VehiclesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
