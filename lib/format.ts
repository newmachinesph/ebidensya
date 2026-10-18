import type { EvidenceKind, OcrStatus } from "./types";

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const longDate = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const shortDate = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPeso(value: number | null): string {
  return value === null ? "Not quantified" : peso.format(value);
}

export function formatDate(iso: string): string {
  return longDate.format(new Date(`${iso}T00:00:00Z`));
}

export function formatShortDate(iso: string): string {
  return shortDate.format(new Date(`${iso}T00:00:00Z`));
}

export type ConfidenceBand = "verified" | "review" | "risk";

export function bandFor(confidence: number): ConfidenceBand {
  if (confidence >= 95) return "verified";
  if (confidence >= 80) return "review";
  return "risk";
}

export const bandLabel: Record<ConfidenceBand, string> = {
  verified: "Read cleanly",
  review: "Review recommended",
  risk: "Not relied upon",
};

export const statusLabel: Record<OcrStatus, string> = {
  verified: "Read cleanly",
  review: "Review recommended",
  unreadable: "Cannot be read",
  manual: "Entered manually",
};

export const kindLabel: Record<EvidenceKind, string> = {
  chat: "Chats",
  receipt: "Receipts",
  contract: "Contracts",
  photograph: "Photographs",
  affidavit: "Affidavits",
  official: "Official records",
  email: "Email",
  financial: "Bank and financial",
};

export function fileSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}
