import { ConfidenceChip } from "@/components/ui/Confidence";
import { getCase } from "@/lib/data";
import { formatShortDate } from "@/lib/format";

/**
 * Not a mock screenshot: this renders the real timeline data and the real
 * confidence component the dashboard uses, at a smaller scale.
 */
export function HeroPreview() {
  const file = getCase("people-vs-cruz");
  if (!file) return null;

  const entries = file.timeline.slice(2, 6);

  return (
    <div className="overflow-hidden rounded-[12px] border border-line bg-surface shadow-[var(--shadow-raise)]">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">{file.summary.title}</p>
          <p className="truncate font-mono text-[11px] text-ink-3">{file.summary.docket}</p>
        </div>
        <span className="whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] text-ink-2">
          {file.summary.fileCount} files
        </span>
      </div>

      <ol className="divide-y divide-line">
        {entries.map((entry) => (
          <li key={entry.id} className="flex gap-4 px-4 py-3.5">
            <time
              dateTime={entry.date}
              className="w-20 shrink-0 pt-0.5 font-mono text-[11px] text-ink-3"
            >
              {formatShortDate(entry.date)}
            </time>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-snug font-medium">{entry.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ConfidenceChip value={entry.confidence} />
                <span className="font-mono text-[11px] text-ink-3">
                  {entry.sources.length} source{entry.sources.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="border-t border-line bg-surface-2 px-4 py-3 text-[12px] leading-relaxed text-ink-2">
        The courier slip behind 18 March reads at 41 percent, so the receiving party is left blank
        rather than guessed.
      </p>
    </div>
  );
}
