import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfidenceChip } from "@/components/ui/Confidence";
import { caseIds, getCase } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export default async function ExhibitsPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const file = getCase(caseId);
  if (!file) notFound();

  const unreliable = file.exhibits.filter((exhibit) => {
    const source = file.evidence.find((item) => item.id === exhibit.evidenceId);
    return source ? source.ocr.confidence < 80 : false;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Proposed exhibits</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
          Lettered in the order the events happened. Re-letter or drop any of them, the numbering
          follows what you keep.
        </p>
      </div>

      {unreliable.length > 0 && (
        <p className="rounded-[8px] border border-review/25 bg-review-soft px-4 py-3 text-[13px] leading-relaxed text-review">
          {unreliable.length === 1 ? "One proposed exhibit rests" : `${unreliable.length} proposed exhibits rest`} on a
          file that could not be read cleanly. Replace the copy before offering it.
        </p>
      )}

      <ul className="overflow-hidden rounded-[12px] border border-line bg-surface">
        {file.exhibits.map((exhibit, index) => {
          const source = file.evidence.find((item) => item.id === exhibit.evidenceId);
          return (
            <li
              key={exhibit.label}
              className={index > 0 ? "border-t border-line" : undefined}
            >
              <Link
                href={`/app/cases/${caseId}/evidence/${exhibit.evidenceId}`}
                className="flex flex-wrap items-start gap-x-5 gap-y-3 px-5 py-4 transition-colors hover:bg-surface-2"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[8px] border border-accent-line bg-accent-soft font-mono text-[13px] font-medium text-accent">
                  {exhibit.label}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium">{exhibit.title}</span>
                  <span className="mt-1 block text-[13px] text-ink-2">
                    Offered for {exhibit.offeredFor.toLowerCase()}
                  </span>
                  {source && (
                    <span className="mt-2 block font-mono text-[11px] text-ink-3">
                      {source.filename}
                      {source.capturedOn ? ` · ${formatDate(source.capturedOn)}` : ""}
                    </span>
                  )}
                </span>

                {source && (
                  <ConfidenceChip value={source.ocr.confidence} status={source.ocr.status} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
