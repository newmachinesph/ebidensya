import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { listCases, upcomingHearings } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default function HearingsPage() {
  const hearings = upcomingHearings();
  const unscheduled = listCases().filter((summary) => summary.nextHearing === null);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Hearings</h1>
        <p className="mt-1.5 text-sm text-ink-2">
          Settings taken from each case file. The hearing view holds one setting at a time.
        </p>
      </header>

      <ul className="space-y-4">
        {hearings.map(({ summary, hearing }) => (
          <li key={summary.id} className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-sm tabular-nums text-accent">
                  {formatDate(hearing.date)} · {hearing.time}
                </p>
                <h2 className="mt-1.5 text-[15px] font-medium">{summary.title}</h2>
                <p className="mt-0.5 text-[13px] text-ink-2">
                  {hearing.purpose}. {hearing.court}.
                </p>
              </div>
              <Link
                href={`/app/cases/${summary.id}/hearing`}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-line-strong px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-surface-2 active:translate-y-px"
              >
                Hearing view
                <ArrowRightIcon size={13} weight="bold" />
              </Link>
            </div>

            <ul className="mt-5 space-y-2 border-t border-line pt-4">
              {hearing.reminders.map((reminder) => (
                <li key={reminder} className="text-[13px] leading-relaxed text-ink-2">
                  {reminder}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {unscheduled.length > 0 && (
        <section>
          <h2 className="text-sm font-medium">No setting yet</h2>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-[12px] border border-line bg-surface">
            {unscheduled.map((summary) => (
              <li key={summary.id}>
                <Link
                  href={`/app/cases/${summary.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 text-[13px] transition-colors hover:bg-surface-2"
                >
                  <span>{summary.title}</span>
                  <span className="font-mono text-[11px] text-ink-3">{summary.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
