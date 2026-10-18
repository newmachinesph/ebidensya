import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";

import { siteData } from "@/lib/data";
import { formatPeso } from "@/lib/format";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Monthly plans in Philippine pesos for solo practitioners, firms and larger offices. No lock-in period.",
};

export default function PricingPage() {
  const { plans, planNotes, faq } = siteData;

  return (
    <>
      <section className="border-b border-line">
        <div className="shell max-w-3xl py-16 md:py-20">
          <h1 className="text-[2rem] leading-[1.08] font-semibold tracking-tight sm:text-4xl md:text-5xl">
            One monthly fee, counted in pages rather than seats
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-2">
            A page is one screenshot or one scanned page. Every plan includes the timeline, the
            exhibit list and the review queue.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="shell py-16 md:py-20">
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col rounded-[12px] border p-7 ${
                  plan.featured
                    ? "border-accent-line bg-accent-soft shadow-[var(--shadow-raise)]"
                    : "border-line bg-canvas"
                }`}
              >
                <h2 className="text-lg font-semibold tracking-tight">{plan.name}</h2>
                <p className="mt-4 font-mono text-3xl tabular-nums">
                  {plan.price === null ? "On request" : formatPeso(plan.price)}
                </p>
                <p className="mt-1.5 text-[13px] text-ink-3">{plan.unit}</p>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-2">{plan.note}</p>

                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-[14px] leading-relaxed">
                      <CheckIcon
                        size={16}
                        weight="bold"
                        className="mt-0.5 shrink-0 text-verified"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/app"
                  className={`mt-7 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] px-5 py-3 text-sm font-medium transition-colors active:translate-y-px ${
                    plan.featured
                      ? "bg-accent text-accent-ink hover:bg-accent-hover"
                      : "border border-line-strong text-ink hover:bg-surface-2"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-ink-3">
            {planNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[0.7fr_1.3fr] md:py-20">
          <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
            Before you decide
          </h2>
          <dl className="divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q}>
                <details className="group">
                  <summary className="flex items-center justify-between gap-6 py-5 text-[15px] font-medium">
                    <dt>{item.q}</dt>
                    <span
                      aria-hidden="true"
                      className="grid size-6 shrink-0 place-items-center rounded-full border border-line text-ink-3 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <dd className="max-w-2xl pb-5 text-[14px] leading-relaxed text-ink-2">{item.a}</dd>
                </details>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="shell flex flex-wrap items-center justify-between gap-6 py-16">
          <p className="max-w-md text-[17px] leading-relaxed">
            Try it against the demo case before spending anything.
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
