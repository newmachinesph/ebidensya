import Link from "next/link";

import { ConfidenceBar, ConfidenceChip } from "@/components/ui/Confidence";
import { reviewQueue } from "@/lib/data";
import { formatShortDate } from "@/lib/format";

export default function ReviewQueuePage() {
  const queue = reviewQueue();

  if (queue.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-line bg-surface p-12 text-center">
        <h1 className="text-lg font-medium">Nothing is waiting for a human read</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-2">
          Every uploaded file cleared the confidence threshold. New uploads that do not clear it
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Review queue</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-2">
          {queue.length} files across all matters, ordered from least readable. Nothing here is
          quoted in a timeline, chronology or exhibit list until it is verified.
        </p>
      </header>

      <ul className="space-y-3">
        {queue.map(({ caseId, caseTitle, item }) => (
          <li key={`${caseId}-${item.id}`}>
            <Link
              href={`/app/cases/${caseId}/evidence/${item.id}`}
              className="block rounded-[12px] border border-line bg-surface p-5 transition-colors hover:border-line-strong"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[14px]">{item.filename}</p>
                  <p className="mt-1 text-[12px] text-ink-3">
                    {caseTitle} · {item.source}
                    {item.capturedOn ? ` · captured ${formatShortDate(item.capturedOn)}` : ""}
                  </p>
                </div>
                <ConfidenceChip value={item.ocr.confidence} status={item.ocr.status} />
              </div>

              {item.ocr.defects.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.ocr.defects.map((defect) => (
                    <li
                      key={defect}
                      className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[12px] text-ink-2"
                    >
                      {defect}
                    </li>
                  ))}
                </ul>
              )}

              {item.ocr.note && (
                <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-2">
                  {item.ocr.note}
                </p>
              )}

              <div className="mt-4 grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
                {item.ocr.fields
                  .filter((field) => field.confidence < 90)
                  .map((field) => (
                    <div
                      key={field.label}
                      className="flex flex-wrap items-center justify-between gap-3"
                    >
                      <span className="text-[13px] text-ink-2">{field.label}</span>
                      <ConfidenceBar value={field.confidence} label={field.label} />
                    </div>
                  ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
