"use client";

type NumberFieldProps = {
  id: string;
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  hint?: string;
  inputMode?: "decimal" | "numeric" | "text";
};

export default function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  inputMode
}: NumberFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        min="0"
        step="0.01"
        {...(inputMode ? { inputMode } : {})}
        value={value ?? ""}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === "") {
            onChange(null);
            return;
          }
          const parsed = Number(raw);
          onChange(Number.isFinite(parsed) && parsed >= 0 ? parsed : null);
        }}
      />
      {hint && <small>{hint}</small>}
    </div>
  );
}
