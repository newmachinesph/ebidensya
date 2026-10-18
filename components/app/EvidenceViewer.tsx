"use client";

import { useState } from "react";
import Image from "next/image";

import { ConfidenceBar, ConfidenceChip } from "@/components/ui/Confidence";
import type { EvidenceItem } from "@/lib/types";

/** Fields below this are never presented as a value the app read. */
const QUOTE_THRESHOLD = 80;

export function EvidenceViewer({ item }: { item: EvidenceItem }) {
  const [enhanced, setEnhanced] = useState(false);
  const [corrections, setCorrections] = useState<Record<string, string>>({});

  const canEnhance = Boolean(item.photoSeed);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[12px] border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h3 className="text-[13px] font-medium">
            {canEnhance ? (enhanced ? "Enhanced view" : "Original as uploaded") : "Page preview"}
          </h3>
          {canEnhance && (
            <div className="inline-flex rounded-[8px] border border-line p-0.5">
              <button
                type="button"
                onClick={() => setEnhanced(false)}
                aria-pressed={!enhanced}
                className={`rounded-[6px] px-3 py-1.5 text-[12px] transition-colors ${
                  !enhanced ? "bg-surface-3 font-medium text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                Original
              </button>
              <button
                type="button"
                onClick={() => setEnhanced(true)}
                aria-pressed={enhanced}
                className={`rounded-[6px] px-3 py-1.5 text-[12px] transition-colors ${
                  enhanced ? "bg-surface-3 font-medium text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                Enhanced
              </button>
            </div>
          )}
        </div>

        {canEnhance ? (
          <>
            <Image
              src={`https://picsum.photos/seed/${item.photoSeed}/1200/800`}
              alt={`Evidence file ${item.filename}`}
              width={1200}
              height={800}
              className="w-full object-cover transition-[filter] duration-300"
              style={{
                filter: enhanced
                  ? "contrast(1.22) saturate(0.72) brightness(1.06)"
                  : "contrast(0.94) saturate(0.9) brightness(0.98)",
              }}
            />
            <p className="border-t border-line px-5 py-3 text-[12px] leading-relaxed text-ink-3">
              Enhancement adjusts contrast and straightening for reading only. The file as uploaded
              is kept unchanged and is the copy that gets produced.
            </p>
          </>
        ) : (
          <p className="px-5 py-10 text-center text-[13px] text-ink-3">
            Page images for this document are held in the case store. Extracted text appears below.
          </p>
        )}
      </section>

      <section className="rounded-[12px] border border-line bg-surface p-5">
        <h3 className="text-[13px] font-medium">Extracted fields</h3>
        <dl className="mt-4 space-y-4">
          {item.ocr.fields.map((field) => {
            const corrected = corrections[field.label];
            const readable = field.value !== null && field.confidence >= QUOTE_THRESHOLD;

            return (
              <div key={field.label} className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:items-start">
                <dt className="pt-1.5 text-[13px] text-ink-2">{field.label}</dt>
                <dd className="space-y-2">
                  {readable ? (
                    <p className="font-mono text-[13px]">{field.value}</p>
                  ) : corrected ? (
                    <p className="font-mono text-[13px]">
                      {corrected}
                      <span className="ml-2 font-sans text-[11px] text-accent">
                        entered by you, just now
                      </span>
                    </p>
                  ) : (
                    <>
                      <label htmlFor={`field-${field.label}`} className="sr-only">
                        Enter the correct value for {field.label}
                      </label>
                      <input
                        id={`field-${field.label}`}
                        type="text"
                        placeholder="Not read, type the correct value"
                        onBlur={(event) => {
                          const value = event.target.value.trim();
                          if (value) setCorrections((prev) => ({ ...prev, [field.label]: value }));
                        }}
                        className="w-full max-w-sm rounded-[8px] border border-dashed border-risk/50 bg-risk-soft px-3 py-2 font-mono text-[13px] text-ink placeholder:font-sans placeholder:text-ink-2 focus:border-accent focus:outline-none"
                      />
                    </>
                  )}
                  {corrected ? (
                    <ConfidenceChip value={100} status="manual" />
                  ) : (
                    <ConfidenceBar value={field.confidence} label={field.label} />
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>
    </div>
  );
}
