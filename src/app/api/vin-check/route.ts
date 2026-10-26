import { NextResponse } from "next/server";
import { getVinWarnings, validateVin } from "@/lib/vin.mjs";

export const runtime = "nodejs";

type VpicRow = Record<string, string | number | null | undefined>;
type VpicResponse = { Results?: VpicRow[] };

const sourceUrl = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended";

const decodedFields: Array<{ key: string; label: string }> = [
  { key: "Make", label: "Make" },
  { key: "Model", label: "Model" },
  { key: "ModelYear", label: "Model year" },
  { key: "Manufacturer", label: "Manufacturer" },
  { key: "VehicleType", label: "Vehicle type" },
  { key: "BodyClass", label: "Body class" },
  { key: "Series", label: "Series" },
  { key: "Trim", label: "Trim" },
  { key: "EngineCylinders", label: "Engine cylinders" },
  { key: "EngineConfiguration", label: "Engine configuration" },
  { key: "EngineModel", label: "Engine model" },
  { key: "DisplacementL", label: "Engine displacement (L)" },
  { key: "FuelTypePrimary", label: "Primary fuel type" },
  { key: "DriveType", label: "Drive type" },
  { key: "TransmissionStyle", label: "Transmission" },
  { key: "PlantCountry", label: "Manufacturing country" },
  { key: "PlantCity", label: "Manufacturing city" }
];

function fieldValue(row: VpicRow, key: string): string {
  const value = row[key];
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { vin?: unknown } | null;
  const checked = validateVin(body?.vin);

  if (!checked.valid) {
    return NextResponse.json({ error: checked.message }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${sourceUrl}/${encodeURIComponent(checked.vin)}?format=json`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(12000)
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "The NHTSA decoder is temporarily unavailable. Please try again shortly." },
        { status: 502 }
      );
    }

    const payload = await response.json() as VpicResponse;
    const row = payload.Results?.[0];

    if (!row) {
      return NextResponse.json(
        { error: "The decoder returned no result for this VIN. Check the number and try again." },
        { status: 422 }
      );
    }

    const fields = decodedFields
      .map(({ key, label }) => ({ label, value: fieldValue(row, key) }))
      .filter((field) => field.value.length > 0);

    const providerWarnings = getVinWarnings(row.ErrorCode);
    const hasIdentity = Boolean(fieldValue(row, "Make") || fieldValue(row, "Model"));
    if (!hasIdentity) {
      const providerMessage = fieldValue(row, "ErrorText");
      return NextResponse.json(
        {
          error: "NHTSA could not return a usable make or model for this VIN. Check the characters and vehicle documents. This does not prove that the vehicle is fake.",
          providerMessage: providerMessage || undefined,
          providerWarnings,
          fields,
          source: { name: "NHTSA vPIC", url: "https://vpic.nhtsa.dot.gov/api/" }
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      vin: checked.vin,
      fields,
      providerWarnings,
      source: { name: "NHTSA vPIC", url: "https://vpic.nhtsa.dot.gov/api/" },
      note: "These are manufacturer-reported technical details available in NHTSA vPIC. Availability and accuracy can vary, especially for vehicles not built for the United States market."
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the NHTSA decoder. Check your connection and try again. No VIN history was created or inferred." },
      { status: 502 }
    );
  }
}
