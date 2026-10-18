import type { CaseFile, CaseSummary, EvidenceItem } from "./types";

import buhay from "@/data/cases/buhay-vs-tanchingco.json";
import kalinga from "@/data/cases/kalinga-weaves-vs-trend-republic.json";
import cruz from "@/data/cases/people-vs-cruz.json";
import sarmiento from "@/data/cases/sarmiento-vs-ilagan.json";
import site from "@/data/site.json";

/** Static import map: the JSON files are the only data source in this build. */
const FILES = {
  "people-vs-cruz": cruz as unknown as CaseFile,
  "buhay-vs-tanchingco": buhay as unknown as CaseFile,
  "sarmiento-vs-ilagan": sarmiento as unknown as CaseFile,
  "kalinga-weaves-vs-trend-republic": kalinga as unknown as CaseFile,
} satisfies Record<string, CaseFile>;

export type CaseId = keyof typeof FILES;

export const siteData = site;

export const caseIds = Object.keys(FILES) as CaseId[];

export function getCase(id: string): CaseFile | null {
  return (FILES as Record<string, CaseFile>)[id] ?? null;
}

export function listCases(): CaseSummary[] {
  return caseIds
    .map((id) => FILES[id].summary)
    .sort((a, b) => b.openedOn.localeCompare(a.openedOn));
}

export function getEvidence(file: CaseFile, id: string): EvidenceItem | null {
  return file.evidence.find((item) => item.id === id) ?? null;
}

/** Evidence the app will not quote from, across every case. */
export function reviewQueue() {
  return caseIds
    .flatMap((id) =>
      FILES[id].evidence
        .filter((item) => item.ocr.status === "review" || item.ocr.status === "unreadable")
        .map((item) => ({ caseId: id, caseTitle: FILES[id].summary.title, item })),
    )
    .sort((a, b) => a.item.ocr.confidence - b.item.ocr.confidence);
}

export function upcomingHearings() {
  return caseIds
    .map((id) => FILES[id])
    .filter((file) => file.hearing !== null)
    .map((file) => ({ summary: file.summary, hearing: file.hearing! }))
    .sort((a, b) => a.hearing.date.localeCompare(b.hearing.date));
}
