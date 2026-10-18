"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import { ConfidenceChip } from "@/components/ui/Confidence";
import { fileSize, formatShortDate, kindLabel } from "@/lib/format";
import type { EvidenceItem, EvidenceKind } from "@/lib/types";

type Props = { caseId: string; evidence: EvidenceItem[] };

const HOLD_STATUSES = new Set(["review", "unreadable"]);

export function EvidenceBrowser({ caseId, evidence }: Props) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<EvidenceKind | "all">("all");
  const [heldOnly, setHeldOnly] = useState(false);

  const kinds = useMemo(() => {
    const seen = new Map<EvidenceKind, number>();
    for (const item of evidence) seen.set(item.kind, (seen.get(item.kind) ?? 0) + 1);
    return [...seen.entries()].sort((a, b) => b[1] - a[1]);
  }, [evidence]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return evidence.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (heldOnly && !HOLD_STATUSES.has(item.ocr.status)) return false;
      if (!needle) return true;
      const haystack = [
        item.filename,
        item.source,
        item.ocr.text ?? "",
        item.tags.join(" "),
        item.ocr.fields.map((field) => `${field.label} ${field.value ?? ""}`).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [evidence, kind, heldOnly, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <MagnifyingGlassIcon
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3"
            aria-hidden="true"
          />
          <label htmlFor="evidence-search" className="sr-only">
            Search inside the extracted text
          </label>
          <input
            id="evidence-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search inside the extracted text"
            className="w-full rounded-[8px] border border-line bg-surface py-2.5 pr-3 pl-9 text-[13px] text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
          />
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[13px]">
          <input
            type="checkbox"
            checked={heldOnly}
            onChange={(event) => setHeldOnly(event.target.checked)}
            className="size-3.5 accent-[var(--c-accent)]"
          />
          Held for review only
        </label>
      </div>

      <ul className="flex flex-wrap gap-2">
        <li>
          <button
            type="button"
            onClick={() => setKind("all")}
            aria-pressed={kind === "all"}
            className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
              kind === "all"
                ? "border-accent-line bg-accent-soft text-accent"
                : "border-line bg-surface text-ink-2 hover:text-ink"
            }`}
          >
            All {evidence.length}
          </button>
        </li>
        {kinds.map(([value, count]) => (
          <li key={value}>
            <button
              type="button"
              onClick={() => setKind(value)}
              aria-pressed={kind === value}
              className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                kind === value
                  ? "border-accent-line bg-accent-soft text-accent"
                  : "border-line bg-surface text-ink-2 hover:text-ink"
              }`}
            >
              {kindLabel[value]} {count}
            </button>
          </li>
        ))}
      </ul>

      {results.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-line bg-surface p-12 text-center">
          <p className="text-[15px] font-medium">No file matches those filters</p>
          <p className="mx-auto mt-1.5 max-w-xs text-[13px] text-ink-2">
            The search runs over extracted text, so a file that could not be read will not match a
            word search.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {results.map((item) => (
            <li key={item.id}>
              <Link
                href={`/app/cases/${caseId}/evidence/${item.id}`}
                className="flex h-full flex-col rounded-[12px] border border-line bg-surface p-5 transition-colors hover:border-line-strong"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 font-mono text-[13px] break-words">{item.filename}</p>
                  {item.exhibit && (
                    <span className="shrink-0 rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 font-mono text-[11px] text-accent">
                      Exh. {item.exhibit}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-[12px] text-ink-3">
                  {kindLabel[item.kind]} · {item.source} · {fileSize(item.sizeKb)}
                  {item.capturedOn ? ` · ${formatShortDate(item.capturedOn)}` : ""}
                </p>

                {item.ocr.text && (
                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
                    {item.ocr.text.replace(/\n+/g, " ")}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
                  <ConfidenceChip value={item.ocr.confidence} status={item.ocr.status} />
                  {item.corroborates.length > 0 && (
                    <span className="font-mono text-[11px] text-ink-3">
                      {item.corroborates.length} cross-reference
                      {item.corroborates.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
