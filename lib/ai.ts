import type { CaseFile, EvidenceItem } from "./types";

/*
  Frontend-only assistant.

  This runs entirely in the browser over the case JSON that is already in the
  bundle: retrieve, then answer only from what was retrieved. It is the same
  shape a hosted model would use (retrieval -> grounded answer -> citations),
  so swapping in a real model is one function body:

      export async function askCase(file, question) {
        const res = await fetch("/api/ask", {
          method: "POST",
          body: JSON.stringify({ caseId: file.summary.id, question }),
        });
        return AiAnswerSchema.parse(await res.json());
      }

  The model call belongs behind that route. An API key must never reach the
  client bundle. The quoting rule below stays on the client either way, so a
  chatty model cannot promote an unreadable scan into a stated fact.
*/

/** Below this the app describes a value as unread, it never states it. */
export const QUOTE_THRESHOLD = 80;

export interface AiCitation {
  evidenceId: string;
  filename: string;
  exhibit: string | null;
  confidence: number;
}

export type AiStatus = "answered" | "held" | "no-match" | "empty";

export interface AiAnswer {
  status: AiStatus;
  /** Rendered one paragraph per line. */
  lines: string[];
  citations: AiCitation[];
  /** Matched the question but sits under the quoting bar. */
  withheld: AiCitation[];
}

const STOP = new Set([
  "the", "and", "for", "was", "were", "what", "when", "who", "whom", "how",
  "why", "did", "does", "are", "has", "have", "had", "this", "that", "with",
  "from", "about", "into", "over", "any", "all", "our", "his", "her", "their",
  "there", "here", "which", "much", "many", "case", "file", "files", "show",
  "tell", "give", "list", "happened", "happen",
]);

function terms(question: string): string[] {
  const found = question.toLowerCase().match(/[a-z0-9][a-z0-9.,-]*/g) ?? [];
  return [...new Set(found.map((t) => t.replace(/[.,-]+$/, "")))].filter(
    (t) => t.length > 2 && !STOP.has(t),
  );
}

function score(haystack: string, needles: string[]): number {
  const text = haystack.toLowerCase();
  return needles.reduce((sum, needle) => (text.includes(needle) ? sum + 1 : sum), 0);
}

function evidenceText(item: EvidenceItem): string {
  return [
    item.filename,
    item.source,
    item.exhibit ?? "",
    item.tags.join(" "),
    item.ocr.text ?? "",
    item.ocr.note ?? "",
    item.ocr.defects.join(" "),
    item.ocr.fields.map((field) => `${field.label} ${field.value ?? ""}`).join(" "),
  ].join(" ");
}

function isQuotable(item: EvidenceItem): boolean {
  if (item.ocr.status === "unreadable" || item.ocr.status === "review") return false;
  return item.ocr.confidence >= QUOTE_THRESHOLD;
}

function cite(item: EvidenceItem): AiCitation {
  return {
    evidenceId: item.id,
    filename: item.filename,
    exhibit: item.exhibit,
    confidence: item.ocr.confidence,
  };
}

function heldAnswer(first: EvidenceItem, withheld: AiCitation[]): AiAnswer {
  const reason = first.ocr.defects.length
    ? first.ocr.defects.join(", ")
    : (first.ocr.note ?? "the page could not be read with enough confidence");
  return {
    status: "held",
    lines: [
      "The files matching that question are held for review, so nothing is stated as fact.",
      `${first.filename} read at ${first.ocr.confidence}% confidence: ${reason}.`,
    ],
    citations: [],
    withheld,
  };
}

export function askCase(file: CaseFile, question: string): AiAnswer {
  const needles = terms(question);
  const empty: AiAnswer = { status: "empty", lines: [], citations: [], withheld: [] };
  if (needles.length === 0) return empty;

  // A question that names one file is about that file, not about what it
  // happens to share words with.
  const named = file.evidence.find((item) =>
    question.toLowerCase().includes(item.filename.toLowerCase()),
  );
  if (named && !isQuotable(named)) return heldAnswer(named, [cite(named)]);

  const matched = file.evidence
    .map((item) => ({ item, hits: score(evidenceText(item), needles) }))
    .filter((row) => row.hits > 0)
    .sort((a, b) => b.hits - a.hits);

  const quotable = matched.filter((row) => isQuotable(row.item));
  const withheld = matched.filter((row) => !isQuotable(row.item)).map((row) => cite(row.item));
  const quotableIds = new Set(quotable.map((row) => row.item.id));

  // A fact is usable only when at least one of its sources is quotable.
  const facts = file.timeline
    .map((entry) => ({
      entry,
      hits: score(`${entry.title} ${entry.detail}`, needles),
    }))
    .filter((row) => row.hits > 0 && row.entry.sources.some((id) => quotableIds.has(id)))
    .sort((a, b) => b.hits - a.hits || a.entry.date.localeCompare(b.entry.date))
    .slice(0, 3);

  if (facts.length > 0) {
    const usedIds = new Set(facts.flatMap((row) => row.entry.sources));
    return {
      status: "answered",
      lines: facts.map((row) => `${row.entry.date} — ${row.entry.title}. ${row.entry.detail}`),
      citations: quotable.filter((row) => usedIds.has(row.item.id)).map((row) => cite(row.item)),
      withheld,
    };
  }

  // No narrative match, fall back to fields the app read cleanly.
  const fieldLines = quotable
    .flatMap((row) =>
      row.item.ocr.fields
        .filter(
          (field) =>
            field.value !== null &&
            field.confidence >= QUOTE_THRESHOLD &&
            score(`${field.label} ${field.value}`, needles) > 0,
        )
        .map((field) => `${field.label}: ${field.value} — read from ${row.item.filename}`),
    )
    .slice(0, 4);

  if (fieldLines.length > 0) {
    return {
      status: "answered",
      lines: fieldLines,
      citations: quotable.slice(0, 4).map((row) => cite(row.item)),
      withheld,
    };
  }

  if (withheld.length > 0) {
    return heldAnswer(matched.find((row) => !isQuotable(row.item))!.item, withheld);
  }

  return { status: "no-match", lines: [], citations: [], withheld: [] };
}

/**
 * Question chips built from this file, then run through askCase so a chip is
 * never offered unless it lands on something. A dead demo chip reads as a bug.
 */
export function suggestedQuestions(file: CaseFile): string[] {
  const flagged = file.evidence.find((item) => !isQuotable(item));
  const witness = file.witnesses[0];
  const exhibit = file.exhibits[0];

  const candidates = [
    file.summary.amountInvolved !== null ? "How much was demanded?" : null,
    witness ? `What does ${witness.name.split(" ").slice(-1)[0]} appear in?` : null,
    exhibit ? `What does ${exhibit.title} show?` : null,
    file.claims[0]?.claim ?? null,
    flagged ? `Why is ${flagged.filename} not being quoted?` : null,
  ].filter((q): q is string => q !== null);

  return candidates
    .filter((q) => {
      const status = askCase(file, q).status;
      return status === "answered" || status === "held";
    })
    .slice(0, 3);
}
