import { NextResponse } from "next/server";
import { getVinWarnings, parseNhtsaVinResponse, validateVin } from "@/lib/vin.mjs";

export const runtime = "nodejs";

const sourceUrl = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const checked = validateVin(isRecord(body) ? body.vin : undefined);

  if (!checked.valid) {
    return NextResponse.json({ error: checked.message }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(
      `${sourceUrl}/${encodeURIComponent(checked.vin)}?format=json`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(12000)
      }
    );
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "The NHTSA decoder took too long to respond. Try again in a moment."
          : "Could not reach the NHTSA decoder. Check your connection and try again."
      },
      { status: timedOut ? 504 : 502 }
    );
  }

  if (!response.ok) {
    const rateLimited = response.status === 429;
    const unavailable = response.status >= 500;
    const headers = response.headers.get("retry-after");
    return NextResponse.json(
      {
        error: rateLimited
          ? "NHTSA is receiving too many requests. Wait a little before trying again."
          : unavailable
            ? "The NHTSA decoder is temporarily unavailable. Please try again shortly."
            : "NHTSA could not process this VIN request. Check the number and try again."
      },
      {
        status: rateLimited || unavailable ? 503 : 502,
        ...(headers ? { headers: { "Retry-After": headers } } : {})
      }
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return NextResponse.json(
      { error: "NHTSA returned a response Portavero could not read. Please try again later." },
      { status: 502 }
    );
  }

  const decoded = parseNhtsaVinResponse(payload, checked.vin);

  if (decoded.kind === "invalid-response") {
    return NextResponse.json(
      { error: "NHTSA returned an unexpected response. Please try again later." },
      { status: 502 }
    );
  }

  if (decoded.kind === "no-result") {
    return NextResponse.json(
      { error: "The decoder returned no result for this VIN. Check the number and try again." },
      { status: 422 }
    );
  }

  if (decoded.kind === "no-data") {
    return NextResponse.json(
      {
        error: "NHTSA did not return usable technical details for this VIN. Check the characters and vehicle documents.",
        providerMessage: decoded.providerMessage,
        providerWarnings: decoded.providerWarnings
      },
      { status: 422 }
    );
  }

  return NextResponse.json(decoded.result);
}
