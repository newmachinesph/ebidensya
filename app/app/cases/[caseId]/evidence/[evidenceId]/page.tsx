import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { EvidenceViewer } from "@/components/app/EvidenceViewer";
import { ConfidenceChip } from "@/components/ui/Confidence";
import { caseIds, getCase, getEvidence } from "@/lib/data";
import { fileSize, formatDate, kindLabel } from "@/lib/format";

export function generateStaticParams() {
  return caseIds.flatMap((caseId) =>
    (getCase(caseId)?.evidence ?? []).map((item) => ({ caseId, evidenceId: item.id })),
  );
}

export default async function EvidenceDetailPage({
  params,
}: {
  params: Promise<{ caseId: string; evidenceId: string }>;
}) {
  const { caseId, evidenceId } = await params;
  const file = getCase(caseId);
  const item = file ? getEvidence(file, evidenceId) : null;
  if (!file || !item) notFound();

  const related = item.corroborates
    .map((id) => getEvidence(file, id))
    .filter((entry) => entry !== null);

  const usedIn = file.timeline.filter((entry) => entry.sources.includes(item.id));

  return (
    <div className="space-y-5">
      <Link
        href={`/app/cases/${caseId}/evidence`}
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink"
      >
        <ArrowLeftIcon size={14} />
        Back to the file
      </Link>

      <header className="rounded-[12px] border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-mono text-[15px] break-words">{item.filename}</h2>
            <p className="mt-1.5 text-[12px] text-ink-3">
              {kindLabel[item.kind]} · {item.source} · {item.pages} page
              {item.pages > 1 ? "s" : ""} · {fileSize(item.sizeKb)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {item.exhibit && (
              <span className="rounded-full border border-accent-line bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent">
                Exhibit {item.exhibit}
              </span>
            )}
            <ConfidenceChip value={item.ocr.confidence} status={item.ocr.status} />
          </div>
        </div>

        <dl className="mt-5 grid gap-x-8 gap-y-3 border-t border-line pt-4 text-[12px] sm:grid-cols-3">
          <div>
            <dt className="text-ink-3">Captured</dt>
            <dd className="mt-0.5">{item.capturedOn ? formatDate(item.capturedOn) : "Not stated"}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Uploaded</dt>
            <dd className="mt-0.5">{formatDate(item.uploadedOn)}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Tags</dt>
            <dd className="mt-0.5 font-mono">{item.tags.join(", ")}</dd>
          </div>
        </dl>

        {item.ocr.defects.length > 0 && (
          <div className="mt-4 rounded-[8px] border border-risk/25 bg-risk-soft p-4">
            <p className="text-[13px] font-medium text-risk">Why this file reads poorly</p>
            <ul className="mt-2 space-y-1 text-[13px] text-risk">
              {item.ocr.defects.map((defect) => (
                <li key={defect}>{defect}</li>
              ))}
            </ul>
            {item.ocr.note && (
              <p className="mt-3 border-t border-risk/20 pt-3 text-[13px] leading-relaxed text-ink-2">
                {item.ocr.note}
              </p>
            )}
          </div>
        )}

        {item.ocr.defects.length === 0 && item.ocr.note && (
          <p className="mt-4 rounded-[8px] border border-line bg-canvas p-4 text-[13px] leading-relaxed text-ink-2">
            {item.ocr.note}
          </p>
        )}
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <EvidenceViewer item={item} />

        <div className="space-y-5">
          {item.ocr.text && (
            <section className="rounded-[12px] border border-line bg-surface p-5">
              <h3 className="text-[13px] font-medium">Extracted text</h3>
              <pre className="mt-3 max-h-96 overflow-auto rounded-[8px] bg-canvas p-4 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink-2">
                {item.ocr.text}
              </pre>
            </section>
          )}

          {related.length > 0 && (
            <section className="rounded-[12px] border border-line bg-surface p-5">
              <h3 className="text-[13px] font-medium">Files that speak to the same facts</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
                Linked for comparison. The app does not treat one file as confirming another.
              </p>
              <ul className="mt-3 space-y-2">
                {related.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/app/cases/${caseId}/evidence/${entry.id}`}
                      className="flex items-center justify-between gap-3 rounded-[8px] border border-line px-3 py-2.5 text-[12px] transition-colors hover:bg-surface-2"
                    >
                      <span className="truncate font-mono">{entry.filename}</span>
                      <ConfidenceChip value={entry.ocr.confidence} showValue />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {usedIn.length > 0 && (
            <section className="rounded-[12px] border border-line bg-surface p-5">
              <h3 className="text-[13px] font-medium">Timeline entries built on this file</h3>
              <ul className="mt-3 space-y-2.5">
                {usedIn.map((entry) => (
                  <li key={entry.id} className="text-[13px]">
                    <span className="font-mono text-[12px] text-ink-3">{entry.date}</span>
                    <p className="mt-0.5 text-ink-2">{entry.title}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
