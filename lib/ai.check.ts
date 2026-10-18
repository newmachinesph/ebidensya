/*
  Self-check for the retrieval rules in ai.ts. No framework on purpose.

      node lib/ai.check.ts

  The rule that matters: a file the app could not read must never end up
  inside an answer, only in `withheld`.
*/
import assert from "node:assert/strict";

import { askCase } from "./ai.ts";
import type { CaseFile, EvidenceItem } from "./types.ts";

function evidence(over: Partial<EvidenceItem> & { id: string }): EvidenceItem {
  return {
    filename: `${over.id}.jpg`,
    kind: "receipt",
    source: "GCash",
    capturedOn: null,
    uploadedOn: "2026-01-01",
    exhibit: null,
    pages: 1,
    sizeKb: 100,
    corroborates: [],
    tags: [],
    ...over,
    ocr: {
      status: "verified",
      confidence: 97,
      defects: [],
      note: null,
      text: null,
      fields: [],
      ...over.ocr,
    },
  } as EvidenceItem;
}

const file = {
  summary: { id: "demo", amountInvolved: 250000 },
  evidence: [
    evidence({
      id: "clean",
      filename: "gcash-transfer.png",
      ocr: { status: "verified", confidence: 97, defects: [], note: null, text: "transfer to Ilagan", fields: [{ label: "Amount", value: "PHP 250,000", confidence: 96 }] },
    }),
    evidence({
      id: "blurred",
      filename: "blurred-receipt.jpg",
      ocr: { status: "unreadable", confidence: 41, defects: ["glare across the total"], note: null, text: "transfer to Ilagan", fields: [] },
    }),
  ],
  timeline: [
    { id: "t1", date: "2026-02-03", title: "Transfer sent", detail: "Funds moved to Ilagan.", confidence: 96, sources: ["clean"], flag: null },
    { id: "t2", date: "2026-02-09", title: "Second transfer", detail: "Only the blurred receipt covers this.", confidence: 40, sources: ["blurred"], flag: null },
  ],
  chronology: [],
  exhibits: [],
  witnesses: [],
  contradictions: [],
  missing: [],
  proofMatrix: { caseType: "", basis: "", elements: [] },
  claims: [],
  binder: [],
  hearing: null,
} as unknown as CaseFile;

// 1. A quotable source answers, and cites the file it read.
const a = askCase(file, "transfer to Ilagan");
assert.equal(a.status, "answered");
assert.ok(a.lines.some((line) => line.includes("Transfer sent")), "expected the clean fact");
assert.deepEqual(a.citations.map((c) => c.evidenceId), ["clean"]);

// 2. The unreadable file never enters the answer, only the withheld list.
assert.ok(!a.lines.join(" ").includes("blurred"), "unreadable file leaked into the answer");
assert.deepEqual(a.withheld.map((c) => c.evidenceId), ["blurred"]);
assert.ok(!a.lines.some((line) => line.includes("Second transfer")), "fact with no quotable source leaked");

// 3. A question only an unreadable file matches refuses instead of guessing.
const held = askCase(file, "blurred receipt");
assert.equal(held.status, "held");
assert.equal(held.citations.length, 0);
assert.ok(held.lines.join(" ").includes("glare across the total"), "expected the defect reason");

// 4. Field fallback when no timeline entry matches.
const field = askCase(file, "amount");
assert.equal(field.status, "answered");
assert.ok(field.lines[0].includes("PHP 250,000"));

// 5. Nothing matched, and empty input.
assert.equal(askCase(file, "helicopter").status, "no-match");
assert.equal(askCase(file, "  the  ").status, "empty");

console.log("ai.check: 5 groups passed");
