import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle import planner for Georgia",
  description: "Plan a Georgia-bound vehicle import budget and review the limits of the preliminary passenger-vehicle excise estimate.",
};

export default function VehicleImportLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
