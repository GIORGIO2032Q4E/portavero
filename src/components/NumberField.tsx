"use client";

import { useEffect, useRef, useState } from "react";
import { parseNonNegativeNumber } from "@/lib/number-input.mjs";

type NumberFieldProps = {
  id: string;
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  hint?: string;
  inputMode?: "decimal" | "numeric" | "text";
  step?: number;
  min?: number;
  max?: number;
  onValidityChange?: (valid: boolean) => void;
};

export default function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  inputMode,
  step = 0.01,
  min = 0,
  max,
  onValidityChange
}: NumberFieldProps) {
  const [error, setError] = useState("");
  const skipValueResetRef = useRef(false);
  const onValidityChangeRef = useRef(onValidityChange);
  onValidityChangeRef.current = onValidityChange;

  useEffect(() => {
    if (skipValueResetRef.current) {
      skipValueResetRef.current = false;
      return;
    }
    setError("");
    onValidityChangeRef.current?.(true);
  }, [value]);

  useEffect(() => {
    setError("");
    onValidityChangeRef.current?.(true);
  }, [step, min, max]);

  const decimalPlaces = String(step).includes(".") ? String(step).split(".")[1].length : 0;
  const inputMax = max ?? Number.MAX_SAFE_INTEGER / (10 ** decimalPlaces);
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        min={min}
        max={inputMax}
        step={step}
        {...(inputMode ? { inputMode } : {})}
        value={value ?? ""}
        onChange={(event) => {
          const parsed = parseNonNegativeNumber(event.target.value, { step, min, max });
          setError(parsed.error ?? "");
          onValidityChangeRef.current?.(!parsed.error);
          skipValueResetRef.current = Boolean(parsed.error) && !Object.is(value, parsed.value);
          onChange(parsed.value);
        }}
      />
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && <small id={`${id}-error`} className="field-error" role="alert">{error}</small>}
    </div>
  );
}
