/**
 * @param {string} sheyvanili
 * @param {{step?: number, min?: number, max?: number}} wesebi
 * @returns {{value: number | null, error: string | null}}
 */
export function parseNonNegativeNumber(sheyvanili, wesebi = {}) {
  const nabiji = wesebi.step ?? 0.01;

  if (!Number.isFinite(nabiji) || nabiji <= 0) {
    return { value: null, error: "This field has an invalid step setting." };
  }

  const atwiladebi = String(nabiji).split(".")[1]?.length ?? 0;
  const gamravlebeli = 10 ** atwiladebi;
  const maqsimumi = wesebi.max ?? Number.MAX_SAFE_INTEGER / gamravlebeli;
  const minimumi = wesebi.min ?? 0;

  if (sheyvanili === "") return { value: null, error: null };

  const ricxvi = Number(sheyvanili);

  if (!Number.isFinite(ricxvi)) {
    return { value: null, error: "Enter a valid number." };
  }

  if (ricxvi < minimumi) {
    const shetyobineba = minimumi === 0
      ? "Amount cannot be negative."
      : `Enter a value of at least ${minimumi}.`;

    return { value: null, error: shetyobineba };
  }

  if (ricxvi > maqsimumi) {
    const shetyobineba = wesebi.max === undefined
      ? "This amount is too large to calculate safely."
      : `Enter a value no greater than ${maqsimumi}.`;

    return { value: null, error: shetyobineba };
  }

  const gamotvlili = ricxvi * gamravlebeli;

  if (!Number.isFinite(gamotvlili) || gamotvlili > Number.MAX_SAFE_INTEGER) {
    return { value: null, error: "This amount is too large to calculate safely." };
  }

  const damrgvalebuli = Math.round(gamotvlili);

  if (Math.abs(gamotvlili - damrgvalebuli) > 1e-7) {
    const shetyobineba = atwiladebi === 0
      ? "Enter a whole number."
      : `Use no more than ${atwiladebi} decimal places.`;

    return { value: null, error: shetyobineba };
  }

  return {
    value: damrgvalebuli / gamravlebeli,
    error: null
  };
}
