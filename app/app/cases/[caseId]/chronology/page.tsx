import Link from "next/link";
import { notFound } from "next/navigation";

import { caseIds, getCase } from "@/lib/data";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export default async function ChronologyPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const file = getCase(caseId);
  if (!file) notFound();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
      <article className="rounded-[12px] border border-line bg-surface p-7 md:p-9">
        <h2 className="text-lg font-semibold tracking-tight">Statement of facts, first draft</h2>
        <p className="mt-1.5 text-[13px] text-ink-2">
          Written from the timeline. Every sentence carries the files it came from.
        </p>

        <div className="mt-7 space-y-5 border-t border-line pt-6">
          {file.chronology.map((paragraph, index) => (
            <p key={paragraph.id} className="text-[15px] leading-[1.75]">
              <span className="mr-2 font-mono text-[12px] text-ink-3">{index + 1}.</span>
              {paragraph.text}{" "}
              <span className="whitespace-nowrap">
                {paragraph.citations.map((id) => {
                  const source = file.evidence.find((item) => item.id === id);
                  if (!source) return null;
                  return (
                    <Link
                      key={id}
                      href={`/app/cases/${caseId}/evidence/${id}`}
                      title={source.filename}
                      className="ml-1 rounded-full border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-ink-2 align-middle transition-colors hover:text-accent"
                    >
                      {source.exhibit ? `Exh. ${source.exhibit}` : id}
                    </Link>
                  );
                })}
              </span>
            </p>
          ))}
        </div>
      </article>

      <aside className="space-y-5">
        <section className="rounded-[12px] border border-line bg-surface p-5">
          <h3 className="text-[13px] font-medium">Before this becomes a pleading</h3>
          <ul className="mt-3 space-y-3 text-[13px] leading-relaxed text-ink-2">
            <li>
              Dates in this draft come from what was extracted. Any entry drawn from a file held for
              review is written without a quoted figure.
            </li>
            <li>
              Nothing here is verified against the record of the court. Check every docket reference
              yourself.
            </li>
            <li>
              The draft carries no allegations of law, no prayer and no verification.
            </li>
          </ul>
        </section>

        <section className="rounded-[12px] border border-line bg-surface p-5">
          <h3 className="text-[13px] font-medium">Files cited</h3>
          <ul className="mt-3 space-y-2">
            {[...new Set(file.chronology.flatMap((p) => p.citations))].map((id) => {
              const source = file.evidence.find((item) => item.id === id);
              if (!source) return null;
              return (
                <li key={id}>
                  <Link
                    href={`/app/cases/${caseId}/evidence/${id}`}
                    className="block truncate font-mono text-[12px] text-ink-2 hover:text-ink"
                  >
                    {source.filename}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>
    </div>
  );
}
