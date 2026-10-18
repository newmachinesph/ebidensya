import Link from "next/link";
import { ArrowRightIcon, CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";

import { ConfidenceChip, ReadinessDial } from "@/components/ui/Confidence";
import { listCases, reviewQueue, upcomingHearings } from "@/lib/data";
import { formatDate, formatPeso, formatShortDate } from "@/lib/format";

const statusTone: Record<string, string> = {
  intake: "text-ink-2",
  drafting: "text-review",
  filed: "text-accent",
  trial: "text-verified",
};

export default function AppOverviewPage() {
  const cases = listCases();
  const queue = reviewQueue();
  const hearings = upcomingHearings();

  const totalFiles = cases.reduce((sum, item) => sum + item.fileCount, 0);
  const flagged = cases.reduce((sum, item) => sum + item.needsReviewCount, 0);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1.5 text-sm text-ink-2">
          Four matters open. {flagged} files are held back from quotation until someone checks them.
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line lg:grid-cols-4">
        {[
          { label: "Active matters", value: String(cases.length), note: "across two branches" },
          { label: "Files indexed", value: String(totalFiles), note: "screenshots, scans, exports" },
          { label: "Held for review", value: String(flagged), note: "never quoted as fact" },
          {
            label: "Next hearing",
            value: hearings[0] ? formatShortDate(hearings[0].hearing.date) : "None set",
            note: hearings[0]?.hearing.purpose ?? "nothing calendared",
          },
        ].map((tile) => (
          <div key={tile.label} className="bg-surface px-4 py-3.5 sm:px-5 sm:py-4">
            <dt className="text-[12px] text-ink-3">{tile.label}</dt>
            <dd className="mt-1.5 font-mono text-xl tabular-nums">{tile.value}</dd>
            <p className="mt-0.5 text-[12px] text-ink-3">{tile.note}</p>
          </div>
        ))}
      </dl>

      <section>
        <h2 className="text-sm font-medium">Matters</h2>
        <ul className="mt-3 grid gap-4 xl:grid-cols-2">
          {cases.map((summary) => (
            <li key={summary.id}>
              <Link
                href={`/app/cases/${summary.id}`}
                className="group flex h-full gap-4 rounded-[12px] border border-line bg-surface p-4 transition-colors hover:border-line-strong sm:gap-5 sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-[15px] font-medium tracking-tight">{summary.title}</h3>
                    <span
                      className={`font-mono text-[11px] uppercase ${statusTone[summary.status]}`}
                    >
                      {summary.status}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-ink-3">{summary.docket}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
                    {summary.causeOfAction}. {summary.court}.
                  </p>

                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
                    <div>
                      <dt className="text-ink-3">Amount</dt>
                      <dd className="font-mono tabular-nums">{formatPeso(summary.amountInvolved)}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-3">Files</dt>
                      <dd className="font-mono tabular-nums">{summary.fileCount}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-3">Held for review</dt>
                      <dd className="font-mono tabular-nums text-review">
                        {summary.needsReviewCount}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-3">Next setting</dt>
                      <dd className="font-mono tabular-nums">
                        {summary.nextHearing ? formatShortDate(summary.nextHearing) : "Not set"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <ReadinessDial value={summary.readiness} />
                  <span className="text-[11px] text-ink-3">ready</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-sm font-medium">Files the app will not quote from</h2>
            <Link
              href="/app/review"
              className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
            >
              Full queue
              <ArrowRightIcon size={13} weight="bold" />
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-[12px] border border-line bg-surface">
            {queue.slice(0, 5).map(({ caseId, caseTitle, item }) => (
              <li key={`${caseId}-${item.id}`}>
                <Link
                  href={`/app/cases/${caseId}/evidence/${item.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px]">{item.filename}</p>
                    <p className="truncate text-[12px] text-ink-3">{caseTitle}</p>
                  </div>
                  <ConfidenceChip value={item.ocr.confidence} status={item.ocr.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium">Calendared</h2>
          <ul className="mt-3 space-y-3">
            {hearings.map(({ summary, hearing }) => (
              <li key={summary.id} className="rounded-[12px] border border-line bg-surface p-5">
                <div className="flex items-center gap-2 text-[13px] font-medium">
                  <CalendarBlankIcon size={15} className="text-accent" aria-hidden="true" />
                  {formatDate(hearing.date)}, {hearing.time}
                </div>
                <p className="mt-2 text-[13px] text-ink-2">{hearing.purpose}</p>
                <p className="mt-0.5 text-[12px] text-ink-3">{hearing.court}</p>
                <Link
                  href={`/app/cases/${summary.id}/hearing`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
                >
                  Hearing view
                  <ArrowRightIcon size={13} weight="bold" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
