import Link from "next/link";
import { notFound } from "next/navigation";

import { caseIds, getCase } from "@/lib/data";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

const severityCopy = {
  high: { label: "Squarely opposed", className: "border-risk/30 bg-risk-soft text-risk" },
  medium: { label: "Worth a decision", className: "border-review/30 bg-review-soft text-review" },
  low: { label: "Minor", className: "border-line bg-surface-2 text-ink-2" },
} as const;

const priorityCopy = {
  critical: { label: "Before filing", className: "text-risk" },
  high: { label: "Before pre-trial", className: "text-review" },
  normal: { label: "When convenient", className: "text-ink-3" },
} as const;

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const file = getCase(caseId);
  if (!file) notFound();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold tracking-tight">Statements that do not sit together</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
          Raised, not resolved. Whether a conflict matters is a call the app does not make.
        </p>

        {file.contradictions.length === 0 ? (
          <p className="mt-4 rounded-[12px] border border-dashed border-line bg-surface px-5 py-8 text-center text-[13px] text-ink-2">
            Nothing in this file contradicts anything else in it yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {file.contradictions.map((item) => {
              const severity = severityCopy[item.severity];
              return (
                <li key={item.id} className="rounded-[12px] border border-line bg-surface p-5">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium ${severity.className}`}
                  >
                    {severity.label}
                  </span>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <blockquote className="border-l-2 border-line pl-4 text-[13px] leading-relaxed">
                      {item.claim}
                    </blockquote>
                    <blockquote className="border-l-2 border-accent pl-4 text-[13px] leading-relaxed">
                      {item.against}
                    </blockquote>
                  </div>

                  <p className="mt-4 border-t border-line pt-3.5 text-[13px] leading-relaxed text-ink-2">
                    {item.observation}
                  </p>

                  <ul className="mt-3 flex flex-wrap gap-2">
                    {item.sources.map((id) => {
                      const source = file.evidence.find((entry) => entry.id === id);
                      if (!source) return null;
                      return (
                        <li key={id}>
                          <Link
                            href={`/app/cases/${caseId}/evidence/${id}`}
                            className="inline-block max-w-[16rem] truncate rounded-full border border-line bg-canvas px-3 py-1 font-mono text-[11px] text-ink-2 hover:text-ink"
                          >
                            {source.filename}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Documents not in the file yet</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
          Each entry names the element it would support and where that document is normally
          obtained.
        </p>

        <ul className="mt-4 overflow-hidden rounded-[12px] border border-line bg-surface">
          {file.missing.map((item, index) => {
            const priority = priorityCopy[item.priority];
            return (
              <li
                key={item.id}
                className={`px-5 py-4 ${index > 0 ? "border-t border-line" : ""}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-[14px] font-medium">{item.document}</h3>
                  <span className={`font-mono text-[11px] uppercase ${priority.className}`}>
                    {priority.label}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{item.why}</p>
                <dl className="mt-3 grid gap-x-8 gap-y-1.5 text-[12px] sm:grid-cols-2">
                  <div className="flex gap-2">
                    <dt className="text-ink-3">Supports</dt>
                    <dd>{item.blocks ?? "General corroboration"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink-3">Where</dt>
                    <dd>{item.where}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
