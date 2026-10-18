"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpIcon, SparkleIcon } from "@phosphor-icons/react";

import { askCase, suggestedQuestions, type AiAnswer } from "@/lib/ai";
import type { CaseFile } from "@/lib/types";

/** Words revealed per tick, so a grounded answer reads like a streamed one. */
const REVEAL_MS = 28;

export function AskCase({ file }: { file: CaseFile }) {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState<AiAnswer | null>(null);
  const [shown, setShown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = suggestedQuestions(file);
  const words = answer ? answer.lines.join("\n").split(" ") : [];
  const streaming = answer !== null && shown < words.length;

  useEffect(() => {
    if (!streaming) return;
    const id = setTimeout(() => setShown((n) => n + 2), REVEAL_MS);
    return () => clearTimeout(id);
  }, [streaming, shown]);

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setAsked(trimmed);
    setQuestion(trimmed);
    setAnswer(askCase(file, trimmed));
    setShown(0);
  }

  const visible = words.slice(0, shown).join(" ");

  return (
    <section className="rounded-[12px] border border-line bg-surface p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <SparkleIcon size={16} className="text-accent" aria-hidden="true" />
        <h2 className="text-sm font-medium">Ask this case file</h2>
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
        Answers are drawn only from files this case read cleanly. Anything held for review is
        listed, never paraphrased into an answer.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(question);
        }}
        className="mt-4 flex gap-2"
      >
        <label htmlFor="ask-case" className="sr-only">
          Ask a question about this case file
        </label>
        <input
          id="ask-case"
          ref={inputRef}
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="When was the demand letter received?"
          className="min-w-0 flex-1 rounded-[8px] border border-line bg-canvas px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-[8px] bg-accent text-accent-ink transition-colors hover:bg-accent-hover active:translate-y-px sm:size-auto sm:px-4"
        >
          <ArrowUpIcon size={16} weight="bold" />
          <span className="sr-only">Ask</span>
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="scroll-x -mx-4 mt-3 flex gap-2 px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {suggestions.map((item) => (
            <li key={item} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  ask(item);
                  inputRef.current?.blur();
                }}
                className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[12px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}

      {answer && (
        <div className="mt-5 border-t border-line pt-4" aria-live="polite">
          <p className="font-mono text-[11px] text-ink-3">{asked}</p>

          {answer.status === "empty" && (
            <p className="mt-2 text-[13px] text-ink-2">
              Ask about a date, an amount, a document or a person in this file.
            </p>
          )}

          {answer.status === "no-match" && (
            <p className="mt-2 text-[13px] text-ink-2">
              Nothing in this case file matches that. The file holds {file.evidence.length} items,
              so the gap is in the evidence, not in the search.
            </p>
          )}

          {answer.lines.length > 0 && (
            <p className="mt-2 text-[13px] leading-relaxed break-words whitespace-pre-line text-ink">
              {visible}
              {streaming && <span className="text-ink-3">…</span>}
            </p>
          )}

          {!streaming && answer.citations.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] tracking-wide text-ink-3 uppercase">Read from</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {answer.citations.map((citation) => (
                  <li key={citation.evidenceId} className="min-w-0 max-w-full">
                    <Link
                      href={`/app/cases/${file.summary.id}/evidence/${citation.evidenceId}`}
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 font-mono text-[11px] text-ink-2 transition-colors hover:text-ink"
                    >
                      <span className="truncate">
                        {citation.exhibit ? `Exh. ${citation.exhibit} · ` : ""}
                        {citation.filename}
                      </span>
                      <span className="shrink-0 tabular-nums text-verified">
                        {citation.confidence}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!streaming && answer.withheld.length > 0 && (
            <div className="mt-4 rounded-[8px] border border-review/30 bg-review-soft p-3">
              <p className="text-[12px] font-medium text-review">
                {answer.withheld.length} matching file
                {answer.withheld.length > 1 ? "s were" : " was"} left out of that answer
              </p>
              <ul className="mt-2 space-y-1">
                {answer.withheld.map((citation) => (
                  <li key={citation.evidenceId}>
                    <Link
                      href={`/app/cases/${file.summary.id}/evidence/${citation.evidenceId}`}
                      className="block truncate font-mono text-[11px] text-ink-2 hover:underline"
                    >
                      {citation.filename} · {citation.confidence}%
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-ink-3">
        Demo runs in the browser over this case file. A hosted model would sit behind your own
        route, with the key on the server and this same quoting rule applied to what comes back.
      </p>
    </section>
  );
}
