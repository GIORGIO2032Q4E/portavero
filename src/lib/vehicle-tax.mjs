const previousExciseRates = [1.5, 1.5, 1.5, 1.4, 1.2, 1.0, 0.8, 0.8, 0.8, 0.9, 1.1, 1.3, 1.5, 1.8, 2.1, 2.4];

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
