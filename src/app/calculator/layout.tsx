import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car import cost estimate",
  description: "Estimate selected Georgian vehicle taxes and the costs of importing a specific car.",
};

export default function CalculatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
