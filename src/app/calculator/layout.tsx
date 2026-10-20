import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import cost calculator",
  description: "Build an import budget from known purchase, freight, insurance, customs, port, and delivery costs. Unknown charges stay visible.",
};

export default function CalculatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
