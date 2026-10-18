import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, MinusIcon, WarningIcon } from "@phosphor-icons/react/dist/ssr";

import { caseIds, getCase } from "@/lib/data";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

const statusCopy = {
  supported: { icon: CheckIcon, label: "Supported", className: "text-verified" },
  partial: { icon: MinusIcon, label: "Partial", className: "text-review" },
  unsupported: { icon: WarningIcon, label: "Not supported", className: "text-risk" },
} as const;

export default async function ProofMatrixPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  const file = getCase(caseId);
  if (!file) notFound();

  const { proofMatrix } = file;
  const tally = proofMatrix.elements.reduce(
    (acc, element) => ({ ...acc, [element.status]: (acc[element.status] ?? 0) + 1 }),
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{proofMatrix.caseType}</h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
            Elements on the left, the evidence in this file beside them.
          </p>
        </div>
        <dl className="flex gap-5 text-[12px]">
          {(["supported", "partial", "unsupported"] as const).map((key) => (
            <div key={key}>
              <dt className={statusCopy[key].className}>{statusCopy[key].label}</dt>
              <dd className="mt-0.5 font-mono text-lg tabular-nums">{tally[key] ?? 0}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="overflow-hidden rounded-[12px] border border-line bg-surface">
        {proofMatrix.elements.map((element, index) => {
          const status = statusCopy[element.status];
          const Icon = status.icon;
          return (
            <li
              key={element.element}
              className={`grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_1fr_9rem] ${
                index > 0 ? "border-t border-line" : ""
              }`}
            >
              <div>
                <h3 className="text-[14px] font-medium">{element.element}</h3>
                <p className="mt-1 font-mono text-[11px] text-ink-3">{element.authority}</p>
              </div>

              <div>
                {element.evidence.length === 0 ? (
                  <p className="text-[13px] text-risk">Nothing on file</p>
                ) : (
                  <ul className="space-y-1.5">
                    {element.evidence.map((id) => {
                      const source = file.evidence.find((item) => item.id === id);
                      if (!source) return null;
                      return (
                        <li key={id}>
                          <Link
                            href={`/app/cases/${caseId}/evidence/${id}`}
                            className="block truncate font-mono text-[12px] text-ink-2 hover:text-ink"
                          >
                            {source.exhibit ? `Exh. ${source.exhibit} · ` : ""}
                            {source.filename}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <p className="mt-2.5 text-[12px] leading-relaxed text-ink-3">{element.note}</p>
              </div>

              <div className={`flex items-start gap-1.5 text-[13px] ${status.className}`}>
                <Icon size={15} weight="bold" className="mt-0.5" aria-hidden="true" />
                {status.label}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-[12px] leading-relaxed text-ink-3">{proofMatrix.basis}</p>
    </div>
  );
}
