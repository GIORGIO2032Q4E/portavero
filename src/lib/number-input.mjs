/**
 * Parse a non-negative number entered into a calculator field.
 * The default step is one cent; step=1 is used for whole-number fields.
 *
 * @param {string} raw
 * @param {{step?: number, min?: number, max?: number}} options
 * @returns {{value: number | null, error: string | null}}
 */
export function parseNonNegativeNumber(raw, options = {}) {
  const step = options.step ?? 0.01;
  const decimals = String(step).includes(".") ? String(step).split(".")[1].length : 0;
  const scale = 10 ** decimals;
  const safeMax = Number.MAX_SAFE_INTEGER / scale;
  const max = options.max ?? safeMax;

  if (raw === "") return { value: null, error: null };

  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return { value: null, error: "Enter a valid number." };
  }
  const min = options.min ?? 0;
  if (value < min) {
    return {
      value: null,
      error: min === 0 ? "Amount cannot be negative." : `Enter a value of at least ${min}.`
    };
  }
  if (!Number.isFinite(step) || step <= 0) {
    return { value: null, error: "This field has an invalid step setting." };
  }
  if (value > max) {
    return {
      value: null,
      error: options.max === undefined
        ? "This amount is too large to calculate safely."
        : `Enter a value no greater than ${max}.`
    };
  }

  const scaled = value * scale;
  if (!Number.isFinite(scaled) || scaled > Number.MAX_SAFE_INTEGER) {
    return { value: null, error: "This amount is too large to calculate safely." };
  }

  const rounded = Math.round(scaled);
  if (Math.abs(scaled - rounded) > 1e-7) {
    return {
      value: null,
      error: decimals === 0
        ? "Enter a whole number."
        : `Use no more than ${decimals} decimal places.`
    };
  }

  return {
    value: rounded / scale,
    error: null
  };
}
