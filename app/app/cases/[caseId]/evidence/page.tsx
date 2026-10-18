import { notFound } from "next/navigation";

import { EvidenceBrowser } from "@/components/app/EvidenceBrowser";
import { caseIds, getCase } from "@/lib/data";

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export default async function EvidencePage({
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
        <h2 className="text-lg font-semibold tracking-tight">Evidence</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-2">
          Sorted on upload. Search runs over the text extracted from each file, including Filipino
          and Taglish chat threads.
        </p>
      </div>
      <EvidenceBrowser caseId={caseId} evidence={file.evidence} />
    </div>
  );
}
