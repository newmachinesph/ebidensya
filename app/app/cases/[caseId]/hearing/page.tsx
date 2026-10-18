import { notFound } from "next/navigation";
import { WarningIcon } from "@phosphor-icons/react/dist/ssr";

import { caseIds, getCase } from "@/lib/data";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return caseIds.filter((caseId) => getCase(caseId)?.hearing).map((caseId) => ({ caseId }));
}

export default async function HearingPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const file = getCase(caseId);
  if (!file?.hearing) notFound();

  const { hearing } = file;
  const witness = file.witnesses.find((entry) => entry.name === hearing.witness);
  const binder = witness ? file.binder.find((entry) => entry.witnessId === witness.id) : undefined;

  return (
    <div className="space-y-5">
      <section className="rounded-[12px] border border-accent-line bg-accent-soft p-7">
        <p className="font-mono text-[13px] text-accent">
          {formatDate(hearing.date)} · {hearing.time}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{hearing.purpose}</h2>
        <p className="mt-1.5 text-[14px] text-ink-2">{hearing.court}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
          <h3 className="text-[13px] font-medium text-ink-3">Issues</h3>
          <ul className="mt-3 space-y-3">
            {hearing.issues.map((issue) => (
              <li key={issue} className="text-[15px] leading-relaxed">
                {issue}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
          <h3 className="text-[13px] font-medium text-ink-3">Exhibits to bring</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {hearing.exhibits.map((label) => {
              const exhibit = file.exhibits.find((entry) => entry.label === label);
              return (
                <li
                  key={label}
                  className="rounded-[8px] border border-line bg-canvas px-3 py-2 text-[13px]"
                >
                  <span className="font-mono text-accent">{label}</span>
                  <span className="ml-2 text-ink-2">{exhibit?.title ?? "Not yet described"}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {hearing.witness && (
        <section className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
          <h3 className="text-[13px] font-medium text-ink-3">Witness on the stand</h3>
          <p className="mt-2 text-xl font-semibold tracking-tight">{hearing.witness}</p>
          {witness && <p className="mt-1 text-[13px] text-ink-2">{witness.role}</p>}

          {binder && (
            <ol className="mt-5 space-y-2.5 border-t border-line pt-4">
              {binder.questions.slice(0, 4).map((question, index) => (
                <li key={question} className="flex gap-3 text-[14px] leading-relaxed">
                  <span className="shrink-0 pt-0.5 font-mono text-[12px] text-ink-3">
                    Q{index + 1}
                  </span>
                  {question}
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      <section className="rounded-[12px] border border-review/30 bg-review-soft p-4 sm:p-6">
        <h3 className="inline-flex items-center gap-2 text-[13px] font-medium text-review">
          <WarningIcon size={15} weight="fill" aria-hidden="true" />
          Read before you walk in
        </h3>
        <ul className="mt-3 space-y-2.5">
          {hearing.reminders.map((reminder) => (
            <li key={reminder} className="text-[14px] leading-relaxed text-ink">
              {reminder}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
