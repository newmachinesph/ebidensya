import Link from "next/link";
import { notFound } from "next/navigation";

import { caseIds, getCase } from "@/lib/data";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

const statusCopy = {
  confirmed: { label: "Confirmed", className: "border-verified/30 bg-verified-soft text-verified" },
  "to-contact": { label: "To contact", className: "border-review/30 bg-review-soft text-review" },
  adverse: { label: "Adverse", className: "border-line bg-surface-2 text-ink-2" },
} as const;

export default async function WitnessesPage({
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
        <h2 className="text-lg font-semibold tracking-tight">Witnesses</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
          Names picked up from signatures, affiants and chat participants. Each one lists the files
          it was found in, so you can see why it was suggested.
        </p>
      </div>

      <ul className="grid gap-4 lg:grid-cols-2">
        {file.witnesses.map((witness) => {
          const status = statusCopy[witness.status];
          return (
            <li key={witness.id} className="rounded-[12px] border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-medium tracking-tight">{witness.name}</h3>
                  <p className="mt-0.5 text-[13px] text-ink-2">{witness.role}</p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-ink-2">{witness.note}</p>

              <ul className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3.5">
                {witness.appearsIn.map((id) => {
                  const source = file.evidence.find((item) => item.id === id);
                  if (!source) return null;
                  return (
                    <li key={id}>
                      <Link
                        href={`/app/cases/${caseId}/evidence/${id}`}
                        className="inline-block max-w-[15rem] truncate rounded-full border border-line bg-canvas px-3 py-1 font-mono text-[11px] text-ink-2 transition-colors hover:text-ink"
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
    </div>
  );
}
