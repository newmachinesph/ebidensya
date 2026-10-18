import Link from "next/link";
import { notFound } from "next/navigation";
import { WarningIcon } from "@phosphor-icons/react/dist/ssr";

import { ConfidenceChip } from "@/components/ui/Confidence";
import { caseIds, getCase } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

const flagCopy = {
  contradiction: "Conflicts with another statement in the file",
  gap: "Rests on a file that could not be read",
} as const;

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const file = getCase(caseId);
  if (!file) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Timeline</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
          Assembled from extracted fields. Each entry carries the files behind it and the confidence
          of the weakest one.
        </p>
      </div>

      <ol className="relative space-y-3 before:absolute before:top-3 before:bottom-3 before:left-[7px] before:w-px before:bg-line">
        {file.timeline.map((entry) => (
          <li key={entry.id} className="relative pl-8">
            <span
              aria-hidden="true"
              className={`absolute top-5 left-0 size-[15px] rounded-full border-2 border-canvas ${
                entry.flag ? "bg-review" : "bg-accent"
              }`}
            />
            <article className="rounded-[12px] border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <time dateTime={entry.date} className="font-mono text-[12px] text-ink-3">
                  {formatDate(entry.date)}
                </time>
                <ConfidenceChip value={entry.confidence} />
              </div>

              <h3 className="mt-2 text-[15px] font-medium tracking-tight">{entry.title}</h3>
              <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-ink-2">
                {entry.detail}
              </p>

              {entry.flag && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-[8px] border border-review/25 bg-review-soft px-3 py-1.5 text-[12px] text-review">
                  <WarningIcon size={14} weight="fill" aria-hidden="true" />
                  {flagCopy[entry.flag]}
                </p>
              )}

              <ul className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3.5">
                {entry.sources.map((sourceId) => {
                  const source = file.evidence.find((item) => item.id === sourceId);
                  if (!source) return null;
                  return (
                    <li key={sourceId}>
                      <Link
                        href={`/app/cases/${caseId}/evidence/${sourceId}`}
                        className="inline-block max-w-full truncate rounded-full border border-line bg-canvas px-3 py-1 font-mono text-[11px] text-ink-2 transition-colors hover:text-ink"
                      >
                        {source.filename}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
