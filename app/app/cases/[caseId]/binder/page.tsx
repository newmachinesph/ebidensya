import Link from "next/link";
import { notFound } from "next/navigation";

import { caseIds, getCase } from "@/lib/data";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export default async function BinderPage({
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
        <h2 className="text-lg font-semibold tracking-tight">Trial binder</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
          One section per witness: what they are called for, a starting set of questions, and the
          documents to have in hand. Edit freely, these are a draft.
        </p>
      </div>

      <div className="space-y-5">
        {file.binder.map((section) => {
          const witness = file.witnesses.find((entry) => entry.id === section.witnessId);
          if (!witness) return null;

          return (
            <section key={section.witnessId} className="rounded-[12px] border border-line bg-surface">
              <header className="border-b border-line px-6 py-4">
                <h3 className="text-[15px] font-medium tracking-tight">{witness.name}</h3>
                <p className="mt-0.5 text-[13px] text-ink-2">
                  {witness.role} · {section.purpose.toLowerCase()}
                </p>
              </header>

              <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1.4fr_0.6fr]">
                <ol className="space-y-3">
                  {section.questions.map((question, index) => (
                    <li key={question} className="flex gap-3 text-[14px] leading-relaxed">
                      <span className="shrink-0 pt-0.5 font-mono text-[12px] text-ink-3">
                        Q{index + 1}
                      </span>
                      {question}
                    </li>
                  ))}
                </ol>

                <div>
                  <h4 className="text-[12px] font-medium text-ink-3">Documents to bring</h4>
                  <ul className="mt-2.5 space-y-2">
                    {section.documents.map((id) => {
                      const source = file.evidence.find((item) => item.id === id);
                      if (!source) return null;
                      return (
                        <li key={id}>
                          <Link
                            href={`/app/cases/${caseId}/evidence/${id}`}
                            className="block rounded-[8px] border border-line bg-canvas px-3 py-2 transition-colors hover:bg-surface-2"
                          >
                            <span className="block font-mono text-[11px] text-accent">
                              {source.exhibit ? `Exhibit ${source.exhibit}` : "Not yet marked"}
                            </span>
                            <span className="mt-0.5 block truncate font-mono text-[12px] text-ink-2">
                              {source.filename}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
