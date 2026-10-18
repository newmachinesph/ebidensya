import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { AskCase } from "@/components/app/AskCase";
import { ConfidenceChip } from "@/components/ui/Confidence";
import { caseIds, getCase } from "@/lib/data";
import { formatShortDate, kindLabel } from "@/lib/format";
import type { EvidenceKind } from "@/lib/types";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

const strengthTone = {
  strong: "text-verified",
  workable: "text-review",
  thin: "text-risk",
} as const;

export default async function CaseOverviewPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const file = getCase(caseId);
  if (!file) notFound();

  const counts = file.evidence.reduce<Record<string, number>>((acc, item) => {
    acc[item.kind] = (acc[item.kind] ?? 0) + 1;
    return acc;
  }, {});

  const held = file.evidence.filter(
    (item) => item.ocr.status === "review" || item.ocr.status === "unreadable",
  );
  const critical = file.missing.filter((item) => item.priority === "critical");

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="min-w-0 space-y-6">
        <AskCase file={file} />

        <section className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium">Latest events</h2>
            <Link
              href={`/app/cases/${caseId}/timeline`}
              className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
            >
              Full timeline
              <ArrowRightIcon size={13} weight="bold" />
            </Link>
          </div>
          <ol className="mt-4 space-y-4">
            {file.timeline
              .slice(-4)
              .reverse()
              .map((entry) => (
                <li key={entry.id} className="flex gap-4">
                  <time
                    dateTime={entry.date}
                    className="w-20 shrink-0 pt-0.5 font-mono text-[12px] text-ink-3"
                  >
                    {formatShortDate(entry.date)}
                  </time>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium">{entry.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{entry.detail}</p>
                    <div className="mt-2">
                      <ConfidenceChip value={entry.confidence} />
                    </div>
                  </div>
                </li>
              ))}
          </ol>
        </section>

        <section className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
          <h2 className="text-sm font-medium">Claim support</h2>
          <ul className="mt-4 divide-y divide-line">
            {file.claims.map((claim) => (
              <li key={claim.claim} className="py-3.5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-[14px] font-medium">{claim.claim}</p>
                  <span
                    className={`font-mono text-[11px] uppercase ${strengthTone[claim.strength]}`}
                  >
                    {claim.strength}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] text-ink-2">
                  {claim.supporting.join(", ")}
                  {claim.missing.length > 0 && (
                    <span className="text-risk"> · missing {claim.missing.join(", ")}</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="min-w-0 space-y-6">
        <section className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
          <h2 className="text-sm font-medium">Evidence on file</h2>
          <ul className="mt-4 space-y-2.5">
            {Object.entries(counts).map(([kind, count]) => (
              <li key={kind} className="flex items-center justify-between gap-3 text-[13px]">
                <span className="text-ink-2">{kindLabel[kind as EvidenceKind]}</span>
                <span className="font-mono tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/app/cases/${caseId}/evidence`}
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
          >
            Browse the file
            <ArrowRightIcon size={13} weight="bold" />
          </Link>
        </section>

        {held.length > 0 && (
          <section className="rounded-[12px] border border-review/30 bg-review-soft p-4 sm:p-6">
            <h2 className="text-sm font-medium text-review">Held for review</h2>
            <ul className="mt-3 space-y-2">
              {held.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/app/cases/${caseId}/evidence/${item.id}`}
                    className="block truncate font-mono text-[12px] hover:underline"
                  >
                    {item.filename}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {critical.length > 0 && (
          <section className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
            <h2 className="text-sm font-medium">Get before filing</h2>
            <ul className="mt-3 space-y-3">
              {critical.map((item) => (
                <li key={item.id}>
                  <p className="text-[13px] font-medium">{item.document}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{item.where}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
