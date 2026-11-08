/**
 * Preliminary vehicle-tax rules currently implemented by Portavero.
 *
 * Scope: selected passenger vehicles classified under HS 8703. This function
 * calculates from the supplied year, engine capacity and configuration. It
 * does not determine tariff classification, registration eligibility,
 * transitional eligibility or whether a vehicle qualifies legally as a
 * classic car.
 *
 * Source material reviewed on 8 November 2026:
 * - Tax Code of Georgia, Articles 188, 197 and 199:
 *   https://matsne.gov.ge/en/document/view/1043717
 * - Revenue Service notice about the April 2026 change:
 *   https://voice.rs.ge/Default.aspx?id=3874
 *
 * Transitional rules are selected manually by the user. The caller must make
 * clear that choosing the previous regime does not establish eligibility.
 */

// Historical age-based excise table used only when the user selects the
// previous regime for a case they believe meets the transitional conditions.
const previousExciseRates = [1.5, 1.5, 1.5, 1.4, 1.2, 1.0, 0.8, 0.8, 0.8, 0.9, 1.1, 1.3, 1.5, 1.8, 2.1, 2.4];

/**
 * Calculate the project's preliminary vehicle-tax figures.
 *
 * @param {{
 *   manufactureYear: number,
 *   declarationYear: number,
 *   engineCc: number,
 *   steering: string,
 *   hybrid: boolean,
 *   classicCar: boolean,
 *   isElectric: boolean,
 *   preAprilRegime: boolean
 * }} input
 * @returns {{
 *   age: number,
 *   eligibleYear: boolean,
 *   validEngine: boolean,
 *   validVehicleType: boolean,
 *   rate: number,
 *   excise: number,
 *   importDuty: number,
 *   registrationRestricted: boolean
 * }}
 */
export function calculateVehicleTaxes({
  manufactureYear,
  declarationYear,
  engineCc,
  steering,
  hybrid,
  classicCar,
  isElectric,
  preAprilRegime
}) {
  const age = declarationYear - manufactureYear;
  const eligibleYear = age >= 0;
  const validEngine = isElectric || (Number.isFinite(engineCc) && engineCc > 0);
  const validVehicleType = !classicCar || age > 30;
  const rateAge = Math.max(0, age);

  let rate = preAprilRegime
    ? previousExciseRates[Math.min(rateAge, previousExciseRates.length - 1)]
    : rateAge <= 6 ? 1.5 : 4.5;

  if (classicCar && rateAge > 30) rate = 1;

  if (!isElectric && !classicCar) {
    if (steering === "right") rate *= 3;
    else if (hybrid && rateAge <= 6) rate *= 0.4;
  }

  const excise = eligibleYear && validEngine && validVehicleType
    ? isElectric
      ? steering === "right" ? (preAprilRegime ? rate * 2000 : 3000) : 0
      : classicCar && rateAge > 30 ? engineCc : engineCc * rate
    : 0;

  const importDuty = eligibleYear && validEngine && validVehicleType && !isElectric
    ? engineCc * 0.05 * (1 + rateAge * 0.05)
    : 0;

  return {
    age,
    eligibleYear,
    validEngine,
    validVehicleType,
    rate,
    excise,
    importDuty,
    registrationRestricted: declarationYear >= 2026 && age > 6 && !isElectric
  };
}
