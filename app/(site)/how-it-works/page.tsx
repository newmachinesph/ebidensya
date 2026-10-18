import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { Reveal } from "@/components/site/Reveal";
import { ConfidenceBar, ConfidenceChip } from "@/components/ui/Confidence";
import { getCase, siteData } from "@/lib/data";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From upload to hearing view: quality check, classification, extraction with per field confidence, timeline, chronology, exhibits, witnesses, conflicts, gaps and the proof matrix.",
};

const CLUSTERS = [
  {
    id: "intake",
    title: "Intake",
    lead: "Everything is read once, and bad copies are named before anything is quoted.",
    steps: ["upload", "quality", "classify", "extract"],
  },
  {
    id: "assembly",
    title: "Assembly",
    lead: "The case narrative is built from extracted fields, never from inference.",
    steps: ["timeline", "chronology", "exhibits", "witnesses"],
  },
  {
    id: "preparation",
    title: "Preparation",
    lead: "What is weak, what is missing, and what you carry into the courtroom.",
    steps: ["conflicts", "gaps", "matrix", "binder"],
  },
];

export default function HowItWorksPage() {
  const { steps } = siteData;
  const stepById = new Map(steps.map((step) => [step.id, step]));
  const demo = getCase("people-vs-cruz")!;
  const courier = demo.evidence.find((item) => item.id === "ev-07")!;

  return (
    <>
      <section className="border-b border-line">
        <div className="shell max-w-3xl py-16 md:py-20">
          <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Twelve passes over the same folder, in the order a paralegal would do them
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-2">
            Nothing here decides the case. Each pass produces something you can check against the
            file it came from.
          </p>
        </div>
      </section>

      {CLUSTERS.map((cluster, clusterIndex) => (
        <section
          key={cluster.id}
          className={clusterIndex % 2 === 0 ? "border-b border-line bg-surface" : "border-b border-line"}
        >
          <div className="shell py-16 md:py-20">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">{cluster.title}</h2>
              <p className="max-w-md text-[15px] text-ink-2">{cluster.lead}</p>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {cluster.steps.map((id, index) => {
                const step = stepById.get(id)!;
                return (
                  <Reveal key={id} delay={index * 0.05}>
                    <article className="h-full rounded-[12px] border border-line bg-canvas p-6">
                      <p className="font-mono text-[11px] tracking-wide text-accent uppercase">
                        {step.verb}
                      </p>
                      <h3 className="mt-2.5 text-lg leading-snug font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{step.body}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* A real low confidence file, shown the way the app shows it */}
      <section className="border-b border-line bg-surface">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 md:py-20">
          <div>
            <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              What a file it cannot read looks like
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
              This courier slip sits in the demo case. It is kept in the file, excluded from every
              quotation, and listed in the review queue with its reasons. The field that matters,
              who received the notice, stays empty.
            </p>
            <Link
              href="/app/cases/people-vs-cruz/evidence/ev-07"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Open this file in the demo
              <ArrowRightIcon size={15} weight="bold" />
            </Link>
          </div>

          <div className="rounded-[12px] border border-line bg-canvas p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[13px]">{courier.filename}</p>
              <ConfidenceChip value={courier.ocr.confidence} status={courier.ocr.status} />
            </div>

            <ul className="mt-5 space-y-2 text-[13px] text-ink-2">
              {courier.ocr.defects.map((defect) => (
                <li key={defect} className="flex gap-2">
                  <span aria-hidden="true" className="text-risk">
                    !
                  </span>
                  {defect}
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3.5 border-t border-line pt-5">
              {courier.ocr.fields.map((field) => (
                <div key={field.label} className="grid gap-1.5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <dt className="text-[13px] text-ink-2">{field.label}</dt>
                  <dd className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[13px] ${field.value ? "" : "text-risk"}`}
                    >
                      {field.value ?? "Unreadable"}
                    </span>
                    <ConfidenceBar value={field.confidence} label={field.label} />
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 rounded-[8px] border border-risk/25 bg-risk-soft px-4 py-3 text-[13px] leading-relaxed text-risk">
              {courier.ocr.note}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="shell flex flex-wrap items-center justify-between gap-6 py-16">
          <p className="max-w-md text-[17px] leading-relaxed">
            The demo case is populated with the same kind of files a Quezon City BP 22 matter
            actually produces.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-[8px] bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover active:translate-y-px"
          >
            Open the demo case
            <ArrowRightIcon size={16} weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
