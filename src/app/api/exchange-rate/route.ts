import { getUnitRate } from "@/lib/currency.mjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

const exchangeRatesUrl = "https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json/";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function GET() {
  let response: Response;

  try {
    response = await fetch(exchangeRatesUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000)
    });
  } catch {
    return NextResponse.json(
      { error: "The official exchange rate is temporarily unavailable." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "The official exchange rate is temporarily unavailable." },
      { status: 502 }
    );
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    return NextResponse.json(
      { error: "The exchange rate service returned an unreadable response." },
      { status: 502 }
    );
  }

  if (!Array.isArray(payload) || !isRecord(payload[0]) || !Array.isArray(payload[0].currencies)) {
    return NextResponse.json(
      { error: "The exchange rate service returned an unexpected response." },
      { status: 502 }
    );
  }

  const usd = payload[0].currencies.find(
    (currency: unknown) => isRecord(currency) && currency.code === "USD"
  );

  if (!isRecord(usd)) {
    return NextResponse.json(
      { error: "The USD exchange rate was not found." },
      { status: 502 }
    );
  }

  const rate = Number(usd.rate);
  const quantity = Number(usd.quantity);
  const rateDate = typeof payload[0].date === "string" ? payload[0].date.slice(0, 10) : "";

  if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(quantity) || quantity <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(rateDate)) {
    return NextResponse.json(
      { error: "The USD exchange rate could not be read." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    rate: unitRate,
    rateDate,
    source: "National Bank of Georgia"
  });
}
