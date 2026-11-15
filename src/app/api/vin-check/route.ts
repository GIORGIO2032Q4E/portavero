import { NextResponse } from "next/server";
import {
  mergeVinDecoderResults,
  parseCardogChassisResponse,
  parseCarsXeVinResponse,
  parseNhtsaVinResponse,
  validateJapaneseChassis,
  validateVin
} from "@/lib/vin.mjs";

export const runtime = "nodejs";

const nhtsaUrl = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended";
const carsXeUrl = "https://api.carsxe.com/v1/international-vin-decoder";
const cardogUrl = "https://api.cardog.app/v2/chassis";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function decodeWithNhtsa(vin: string) {
  try {
    const response = await fetch(
      `${nhtsaUrl}/${encodeURIComponent(vin)}?format=json`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(12000)
      }
    );

    if (!response.ok) {
      const rateLimited = response.status === 429;
      const unavailable = response.status >= 500;
      const retryAfter = response.headers.get("retry-after");
      return {
        decoded: null,
        failure: {
          status: rateLimited || unavailable ? 503 : 502,
          retryAfter,
          error: rateLimited
            ? "The VIN lookup service is receiving too many requests. Wait a little before trying again."
            : unavailable
              ? "The VIN lookup service is temporarily unavailable."
              : "The VIN could not be checked by the first data source."
        }
      };
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return {
        decoded: null,
        failure: {
          status: 502,
          retryAfter: null,
          error: "The first VIN data source returned a response that could not be read."
        }
      };
    }

    return { decoded: parseNhtsaVinResponse(payload, vin), failure: null };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return {
      decoded: null,
      failure: {
        status: timedOut ? 504 : 502,
        retryAfter: null,
        error: timedOut
          ? "The first VIN data source took too long to respond."
          : "Could not connect to the first VIN data source."
      }
    };
  }
}

async function decodeWithCarsXe(vin: string, apiKey: string) {
  const url = new URL(carsXeUrl);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("vin", vin);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "force-cache",
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) return null;
    const payload: unknown = await response.json().catch(() => null);
    const decoded = parseCarsXeVinResponse(payload, vin);
    return decoded.result ? decoded : null;
  } catch {
    return null;
  }
}

async function decodeWithCardog(chassis: string, apiKey: string) {
  try {
    const response = await fetch(`${cardogUrl}/${encodeURIComponent(chassis)}`, {
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
        "Cardog-Version": "2026-10-26"
      },
      cache: "force-cache",
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { decoded: null, status: 422, error: "No Japanese chassis record was found. Check the model code and serial against the vehicle plate and export documents." };
      }
      if (response.status === 400) {
        return { decoded: null, status: 400, error: "The chassis number format was not accepted. Enter it exactly as shown on the vehicle plate or export documents." };
      }
      if ([401, 402, 403].includes(response.status)) {
        return { decoded: null, status: 503, error: "The Japanese chassis lookup is unavailable with the configured provider key or credit allowance." };
      }
      if (response.status === 429) {
        return { decoded: null, status: 503, error: "The Japanese chassis lookup has reached its request limit. Try again later." };
      }
      return { decoded: null, status: 502, error: "The Japanese chassis data source is temporarily unavailable." };
    }

    const payload: unknown = await response.json().catch(() => null);
    const decoded = parseCardogChassisResponse(payload, chassis);
    if (!decoded.result) {
      return {
        decoded: null,
        status: decoded.kind === "invalid-response" ? 502 : 422,
        error: decoded.kind === "invalid-response"
          ? "The Japanese chassis data source returned an unreadable response."
          : "No matching Japanese chassis details were found. Check the number against the vehicle documents."
      };
    }
    return { decoded, status: 200, error: null };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return {
      decoded: null,
      status: timedOut ? 504 : 502,
      error: timedOut
        ? "The Japanese chassis lookup took too long to respond."
        : "Could not connect to the Japanese chassis data source."
    };
  }
}

function needsInternationalLookup(decoded: { kind?: string; result?: { vehicle?: Record<string, unknown> } } | null) {
  if (!decoded?.result?.vehicle) return true;
  const vehicle = decoded.result.vehicle;
  return decoded.kind !== "complete" ||
    !vehicle.make ||
    !vehicle.model ||
    !vehicle.modelYear ||
    (!vehicle.engineCc && vehicle.isElectric !== true);
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const rawIdentifier = isRecord(body)
    ? (typeof body.identifier === "string" ? body.identifier : body.vin)
    : undefined;
  const identifierType = isRecord(body) && body.identifierType === "japanese-chassis"
    ? "japanese-chassis"
    : "vin";

  if (identifierType === "japanese-chassis") {
    const checked = validateJapaneseChassis(rawIdentifier);
    if (!checked.valid) {
      return NextResponse.json({ error: checked.message }, { status: 400 });
    }

    const cardogApiKey = process.env.CARDOG_API_KEY?.trim();
    if (!cardogApiKey) {
      return NextResponse.json({
        error: "Japanese chassis lookup is not configured yet. Add a private CARDOG_API_KEY to enable it, or enter the car details manually."
      }, { status: 503 });
    }

    const lookup = await decodeWithCardog(checked.chassis, cardogApiKey);
    if (!lookup.decoded?.result) {
      return NextResponse.json({ error: lookup.error }, { status: lookup.status });
    }

    return NextResponse.json({
      ...lookup.decoded.result,
      identifier: lookup.decoded.result.chassis,
      identifierType: "japanese-chassis",
      cardogConfigured: true
    });
  }

  const checked = validateVin(rawIdentifier);
  if (!checked.valid) {
    return NextResponse.json({ error: checked.message }, { status: 400 });
  }

  const nhtsa = await decodeWithNhtsa(checked.vin);
  let decoded = nhtsa.decoded;
  const carsXeApiKey = process.env.CARSXE_API_KEY?.trim();
  const internationalProviderConfigured = Boolean(carsXeApiKey);

  if (carsXeApiKey && needsInternationalLookup(decoded)) {
    const international = await decodeWithCarsXe(checked.vin, carsXeApiKey);
    if (international) {
      decoded = mergeVinDecoderResults(decoded, international) as typeof decoded;
    }
  }

  if (!decoded?.result) {
    if (nhtsa.failure) {
      return NextResponse.json(
        { error: nhtsa.failure.error, internationalProviderConfigured },
        {
          status: nhtsa.failure.status,
          ...(nhtsa.failure.retryAfter
            ? { headers: { "Retry-After": nhtsa.failure.retryAfter } }
            : {})
        }
      );
    }

    if (decoded?.kind === "invalid-response") {
      return NextResponse.json(
        { error: "The VIN lookup returned an unexpected response. Please try again later.", internationalProviderConfigured },
        { status: 502 }
      );
    }

    const error = decoded?.kind === "no-result"
      ? "The available VIN decoders returned no result. Check the VIN and the vehicle documents."
      : "No technical vehicle details were found by the available VIN decoders. Some Japanese domestic-market vehicles use a chassis number instead of a 17-character VIN; select the Japanese chassis-number option to check one when that lookup is configured.";
    return NextResponse.json({ error, internationalProviderConfigured }, { status: 422 });
  }

  return NextResponse.json({
    ...decoded.result,
    identifier: checked.vin,
    identifierType: "vin",
    internationalProviderConfigured
  });
}
