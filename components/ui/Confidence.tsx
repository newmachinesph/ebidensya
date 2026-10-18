import { bandFor, statusLabel, type ConfidenceBand } from "@/lib/format";
import type { OcrStatus } from "@/lib/types";

const tone: Record<ConfidenceBand, { chip: string; bar: string; text: string }> = {
  verified: {
    chip: "bg-verified-soft text-verified border-verified/25",
    bar: "bg-verified",
    text: "text-verified",
  },
  review: {
    chip: "bg-review-soft text-review border-review/25",
    bar: "bg-review",
    text: "text-review",
  },
  risk: {
    chip: "bg-risk-soft text-risk border-risk/30",
    bar: "bg-risk",
    text: "text-risk",
  },
};

type ChipProps = {
  value: number;
  status?: OcrStatus;
  /** Hide the numeral for fields that were typed in by a person. */
  showValue?: boolean;
};

export function ConfidenceChip({ value, status, showValue = true }: ChipProps) {
  if (status === "manual") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-line bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
        Entered manually
      </span>
    );
  }

  const band = bandFor(value);
  const label = status ? statusLabel[status] : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone[band].chip}`}
    >
      {showValue && <span className="font-mono tabular-nums">{value}%</span>}
      {label ?? ""}
    </span>
  );
}

export function ConfidenceBar({ value, label }: { value: number; label?: string }) {
  const band = bandFor(value);
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-surface-3"
        role="img"
        aria-label={`${label ? `${label}: ` : ""}confidence ${value} percent`}
      >
        <div className={`h-full rounded-full ${tone[band].bar}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`font-mono text-xs tabular-nums ${tone[band].text}`}>{value}%</span>
    </div>
  );
}

export function ReadinessDial({ value }: { value: number }) {
  const band = bandFor(value);
  const stroke =
    band === "verified"
      ? "var(--c-verified)"
      : band === "review"
        ? "var(--c-review)"
        : "var(--c-risk)";
  const circumference = 2 * Math.PI * 26;

  return (
    <div className="relative grid size-16 place-items-center">
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--c-surface-3)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * circumference} ${circumference}`}
        />
      </svg>
      <span className="absolute font-mono text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}
