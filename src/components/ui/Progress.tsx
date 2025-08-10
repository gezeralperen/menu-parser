import React from "react";

export function Progress({
  value = 0,
  label,
}: {
  value?: number;
  label?: string;
}) {
  return (
    <div
      className="progress"
      aria-live="polite"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ ["--progress" as any]: `${value}%` }}
    >
      <span />
      {label ? (
        <p className="body muted" style={{ marginTop: 6 }}>
          {label}
        </p>
      ) : null}
    </div>
  );
}
