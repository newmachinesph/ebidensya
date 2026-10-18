import { notFound } from "next/navigation";

import { CaseNav } from "@/components/app/CaseNav";
import { ReadinessDial } from "@/components/ui/Confidence";
import { caseIds, getCase } from "@/lib/data";
import { formatDate, formatPeso } from "@/lib/format";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export default async function CaseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const file = getCase(caseId);
  if (!file) notFound();

  const { summary } = file;

  return (
    <div className="space-y-6">
      <header className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{summary.title}</h1>
            <p className="mt-1 font-mono text-[12px] text-ink-3">{summary.docket}</p>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-2">
              {summary.causeOfAction}. {summary.court}. Filed for {summary.client} as{" "}
              {summary.clientRole.toLowerCase()} against {summary.adverse}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ReadinessDial value={summary.readiness} />
            <div className="text-[12px] text-ink-3">
              <p className="text-ink-2">File readiness</p>
              <p>{summary.needsReviewCount} items held for review</p>
            </div>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-5 text-[12px] sm:mt-6 sm:gap-x-8 lg:grid-cols-4">
          <div>
            <dt className="text-ink-3">Lead counsel</dt>
            <dd className="mt-0.5">{summary.lead}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Amount involved</dt>
            <dd className="mt-0.5 font-mono tabular-nums">{formatPeso(summary.amountInvolved)}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Opened</dt>
            <dd className="mt-0.5">{formatDate(summary.openedOn)}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Next setting</dt>
            <dd className="mt-0.5">
              {summary.nextHearing ? formatDate(summary.nextHearing) : "Not yet calendared"}
            </dd>
          </div>
        </dl>
      </header>

      <CaseNav caseId={caseId} hasHearing={file.hearing !== null} />

      <div>{children}</div>
    </div>
  );
}
